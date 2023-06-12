import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useCatch,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Budget, Income, Outgo } from "~/models/budget.server";

import {
  addIncome,
  addOutgo,
  deleteBudget,
  deleteBudgetIncome,
  deleteBudgetOutgo,
  getBudget,
  getGroupedTotalOutgoes,
  getLatestIncomes,
  getLatestOutgoes,
  getTotalIncome,
  getTotalOutgo,
} from "~/models/budget.server";
import { requireUser, requireUserId } from "~/session.server";
import { format } from "date-fns";
import { Box } from "~/components/box";
import { TopTable } from "~/components/widgets/topTable";
import { TrashIcon, UploadIcon } from "@heroicons/react/solid";
import * as React from "react";
import { useFileUpload } from "~/hooks/useFileUpload";
import { getJsonFromCsvFile } from "~/helpers/file";
import { ImportAccountStatementModal } from "~/components/Modals/ImportAccountStatementModal";
import { useState } from "react";
import { getAllOutgoCategories } from "~/models/outgoCategories.server";
import { OutgoCategory } from "@prisma/client";
import { LatestTransactionTable } from "~/components/LatestTransactionTable";

type LoaderData = {
  budget: Budget;
  totalIncome: number;
  totalOutgo: number;
  incomes?: Income[] | null;
  outgoes?: Outgo[] | null;
  groupedTotalOutgoes?: any;
  outgoCategories?: OutgoCategory[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id: userId, email: userEmail } = await requireUser(request);
  invariant(params.budgetId, "noteId not found");

  const budget = await getBudget({ userId, id: params.budgetId });
  const incomes = await getLatestIncomes(params.budgetId);
  const outgoes = await getLatestOutgoes(params.budgetId);
  const outgoCategories = await getAllOutgoCategories(userEmail);

  const totalIncome = await getTotalIncome(params.budgetId);
  const totalOutgo = await getTotalOutgo(params.budgetId);
  const groupedTotalOutgoes = await getGroupedTotalOutgoes(
    params.budgetId,
    userEmail
  );

  if (!budget) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({
    budget,
    incomes: incomes || [],
    outgoes: outgoes || [],
    totalIncome,
    totalOutgo,
    groupedTotalOutgoes,
    outgoCategories,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const userId = await requireUserId(request);
  invariant(params.budgetId, "budgetId not found");

  const intent = formData.get("intent");

  if (intent === "delete_income") {
    const incomeId = formData.get("incomeId") as string;
    await deleteBudgetIncome({ id: incomeId, budgetId: params.budgetId });

    return "/";
  }

  if (intent === "delete_outgo") {
    const incomeId = formData.get("outgoId") as string;
    await deleteBudgetOutgo({ id: incomeId, budgetId: params.budgetId });

    return "/";
  }

  if (intent === "upload_statements") {
    const statements = JSON.parse(formData.get("statements")!.toString());
    statements
      .filter((s: any) => s.amount < 0)
      .map(async (s: any) => {
        await addOutgo({
          amount: Number(s.amount),
          description: s.description,
          budgetId: params!.budgetId!,
          date: new Date(s.date),
          outgoCategoryId: s.outgoCategoryId,
          subcategory: s.subcategory,
        });
      });

    statements
      .filter((s: any) => s.amount > 0)
      .map(async (s: any) => {
        await addIncome({
          budgetId: params!.budgetId!,
          amount: Number(s.amount),
          description: s.description,
          date: new Date(s.date),
        });
      });

    return json(statements);
  }

  await deleteBudget({ userId, id: params.budgetId });

  return redirect("/budgets");
};

export default function NoteDetailsPage() {
  const data = useLoaderData() as LoaderData;
  const [files, uploadFile] = useFileUpload();
  const [statements, setStatements] = useState<object[]>([]);
  const submit = useSubmit();

  return (
    <div className={"px-4 pt-6"}>
      <ImportAccountStatementModal
        statements={statements}
        categories={data.outgoCategories}
        onSubmit={(data) => {
          const formData = new FormData();

          formData.set("intent", "upload_statements");
          formData.set("statements", JSON.stringify(data));

          submit(formData, {
            method: "post",
          });
        }}
      />
      <div>
        <div className={"flex items-center justify-between"}>
          <div className={"flex items-center"}>
            <h3 className="text-2xl font-bold">{data.budget.name}</h3>
          </div>
          <div className={"sm:flex"}>
            <button
              type="submit"
              name={"intent"}
              title={"Upload categories"}
              onClick={() => {
                uploadFile!(
                  { accept: "csv", multiple: false },
                  (file: File) => {
                    getJsonFromCsvFile(file).then((json: object[]) => {
                      const _statements = json.map((s: any) => {
                        return {
                          date: s["Data transakcji"],
                          amount: s["Obciążenia"]
                            ? s["Obciążenia"]
                            : s["Uznania"],
                          budgetId: "xxx",
                          outgoCategoryId: data.outgoCategories![0].id,
                          subcategory:
                            data.outgoCategories![0].subcategories.split(
                              ","
                            )[0],
                          description: s["Opis"],
                        };
                      });

                      setStatements(_statements);
                    });
                  }
                );
              }}
              value={"upload_categories"}
              className="inline-flex cursor-pointer items-center py-2 text-center "
            >
              <UploadIcon className="h-5 w-5 cursor-pointer " />
            </button>

            <Form method="post" className={"ml-3 mr-3"}>
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center py-2 text-center "
              >
                <TrashIcon className="h-5 w-5 cursor-pointer text-red-500" />
              </button>
            </Form>
          </div>
        </div>
        <hr className="my-4" />
      </div>
      <div
        className={
          "grid w-full grid-cols-1 gap-4 pb-4 xl:grid-cols-3 2xl:grid-cols-2"
        }
      >
        <Box amount={data.totalIncome} secondaryText={"Total incomes"} />
        <Box amount={data.totalOutgo} secondaryText={"Total outgoes"} />
      </div>
      <div
        className={
          "grid w-full grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-2"
        }
      >
        <LatestTransactionTable type={"Income"} transactions={data.incomes} />
        <LatestTransactionTable type={"Outgo"} transactions={data.outgoes} />

        {/*<div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8">*/}
        {/*  <div className="mb-4 flex items-center justify-between">*/}
        {/*    <div>*/}
        {/*      <h3 className="mb-2 text-xl font-bold text-gray-900">*/}
        {/*        Latest Transactions*/}
        {/*      </h3>*/}
        {/*      <span className="text-base font-normal text-gray-500">*/}
        {/*        This is a list of latest transactions*/}
        {/*      </span>*/}
        {/*    </div>*/}
        {/*    <div className="flex-shrink-0">*/}
        {/*      <Link*/}
        {/*        to="outgoes"*/}
        {/*        className="rounded-lg p-2 text-sm font-medium text-cyan-600 hover:bg-gray-100"*/}
        {/*      >*/}
        {/*        View all*/}
        {/*      </Link>*/}
        {/*      <Link*/}
        {/*        to="outgoes/add"*/}
        {/*        className="rounded-lg p-2 text-sm font-medium text-cyan-600 hover:bg-gray-100"*/}
        {/*      >*/}
        {/*        Add*/}
        {/*      </Link>*/}
        {/*    </div>*/}
        {/*  </div>*/}

        {/*  <div className="mt-8 flex flex-col">*/}
        {/*    <div className="overflow-x-auto rounded-lg">*/}
        {/*      <div className="inline-block min-w-full align-middle">*/}
        {/*        <div className="overflow-hidden shadow sm:rounded-lg">*/}
        {/*          {data?.outgoes?.length === 0 ? (*/}
        {/*            <div className={"text text-center"}>*/}
        {/*              <div className={"text-underline text-zinc-500"}>*/}
        {/*                Great! You have no outgoes*/}
        {/*              </div>*/}
        {/*              <div>*/}
        {/*                <Link*/}
        {/*                  className={*/}
        {/*                    "rounded-lg p-1 text-sm font-medium text-cyan-600 hover:bg-gray-100"*/}
        {/*                  }*/}
        {/*                  to="outgoes/add"*/}
        {/*                >*/}
        {/*                  Add your first outgo!*/}
        {/*                </Link>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*          ) : (*/}
        {/*            <table className="min-w-full divide-y divide-gray-200">*/}
        {/*              <thead className="bg-gray-50">*/}
        {/*                <tr>*/}
        {/*                  <th*/}
        {/*                    scope="col"*/}
        {/*                    className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"*/}
        {/*                  >*/}
        {/*                    Transaction*/}
        {/*                  </th>*/}
        {/*                  <th*/}
        {/*                    scope="col"*/}
        {/*                    className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"*/}
        {/*                  >*/}
        {/*                    Date &amp; Time*/}
        {/*                  </th>*/}
        {/*                  <th*/}
        {/*                    scope="col"*/}
        {/*                    className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"*/}
        {/*                  >*/}
        {/*                    Amount*/}
        {/*                  </th>*/}
        {/*                  <th*/}
        {/*                    scope="col"*/}
        {/*                    className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"*/}
        {/*                  >*/}
        {/*                    Actions*/}
        {/*                  </th>*/}
        {/*                </tr>*/}
        {/*              </thead>*/}
        {/*              <tbody className="bg-white">*/}
        {/*                {data?.outgoes?.map((outgo) => {*/}
        {/*                  return (*/}
        {/*                    <tr key={outgo.id}>*/}
        {/*                      <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-900">*/}
        {/*                        <span className="font-semibold">*/}
        {/*                          {outgo.description.length > 0*/}
        {/*                            ? outgo.description*/}
        {/*                            : outgo?.outgoCategory?.name}*/}
        {/*                        </span>*/}
        {/*                      </td>*/}
        {/*                      <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500">*/}
        {/*                        {format(new Date(outgo.date), "PP")}*/}
        {/*                      </td>*/}
        {/*                      <td className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900">*/}
        {/*                        {outgo.amount}*/}
        {/*                      </td>*/}
        {/*                      <td>*/}
        {/*                        <Form method="post">*/}
        {/*                          <input*/}
        {/*                            type="text"*/}
        {/*                            className={"hidden"}*/}
        {/*                            name={"outgoId"}*/}
        {/*                            value={outgo.id}*/}
        {/*                            readOnly={true}*/}
        {/*                          />*/}
        {/*                          <button*/}
        {/*                            type="submit"*/}
        {/*                            className="whitespace-nowrap p-4 text-sm"*/}
        {/*                            name={"intent"}*/}
        {/*                            value={"delete_outgo"}*/}
        {/*                          >*/}
        {/*                            Delete*/}
        {/*                          </button>*/}
        {/*                        </Form>*/}
        {/*                      </td>*/}
        {/*                    </tr>*/}
        {/*                  );*/}
        {/*                })}*/}
        {/*              </tbody>*/}
        {/*            </table>*/}
        {/*          )}*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8" />*/}
        <TopTable data={data.groupedTotalOutgoes} total={data.totalOutgo} />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
