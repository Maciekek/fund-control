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
import { da } from "date-fns/locale";

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
