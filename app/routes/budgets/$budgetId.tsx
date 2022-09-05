import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Budget, Income, Outgo } from "~/models/budget.server";

import {
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
import { UploadIcon } from "@heroicons/react/solid";
import * as React from "react";
import { useFileUpload } from "~/hooks/useFileUpload";
import { getJsonFromCsvFile } from "~/helpers/file";
import Modal from "~/components/Modal";
import { ImportAccountStatementModal } from "~/components/Modals/ImportAccountStatementModal";
import { useState } from "react";
import { getAllOutgoCategories } from "~/models/outgoCategories.server";
import { OutgoCategory } from "@prisma/client";

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

  console.log(38, "groupedTotalOutgoes", groupedTotalOutgoes);
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

  await deleteBudget({ userId, id: params.budgetId });

  return redirect("/budgets");
};

export default function NoteDetailsPage() {
  const data = useLoaderData() as LoaderData;
  const [files, uploadFile] = useFileUpload();
  const [statements, setStatements] = useState<object[]>([]);
  return (
    <div className={"px-4 pt-6"}>
      <ImportAccountStatementModal
        statements={statements}
        categories={data.outgoCategories}
      />
      <div>
        <div className={"flex items-center justify-between"}>
          <div className={"flex items-center"}>
            <h3 className="text-2xl font-bold">{data.budget.name}</h3>
            <Form method="post" className={"ml-3"}>
              <button
                type="submit"
                className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Delete
              </button>
            </Form>
          </div>
          <div>
            <button
              type="submit"
              name={"intent"}
              title={"Upload categories"}
              onClick={() => {
                uploadFile({ accept: "csv", multiple: false }, (file: File) => {
                  getJsonFromCsvFile(file).then((json: object[]) => {
                    console.log(121, json);
                    setStatements(json);
                  });
                });
              }}
              value={"upload_categories"}
              className="inline-flex cursor-pointer items-center py-2 text-center "
            >
              <UploadIcon className="h-5 w-5 cursor-pointer " />
            </button>
          </div>
        </div>
        <hr className="my-4" />
      </div>
      <div
        className={
          "grid w-full grid-cols-1 gap-4 pb-4 xl:grid-cols-3 2xl:grid-cols-2"
        }
      >
        <Box
          mainText={data.totalIncome.toString()}
          secondaryText={"Total incomes"}
        />
        <Box
          mainText={data.totalOutgo.toString()}
          secondaryText={"Total outgoes"}
        />
      </div>
      <div
        className={
          "grid w-full grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-2"
        }
      >
        <div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 ">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Incomes</h3>
              <span className="text-base font-normal text-gray-500">
                Scheduled incomes (10 latest)
              </span>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="incomes/add"
                className="rounded-lg p-2 text-sm font-medium text-cyan-600 hover:bg-gray-100"
              >
                Add
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col">
            <div className="overflow-x-auto rounded-lg">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow sm:rounded-lg">
                  {data?.incomes?.length === 0 ? (
                    <div className={"text text-center"}>
                      <div className={"text-underline text-zinc-500"}>
                        You have no incomes
                      </div>
                      <div>
                        <Link
                          className={
                            "rounded-lg p-1 text-sm font-medium text-cyan-600 hover:bg-gray-100"
                          }
                          to="incomes/add"
                        >
                          Add your first income!
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Title
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Date &amp; Time
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {data?.incomes?.map((income) => {
                          return (
                            <tr key={income.id}>
                              <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-900">
                                <span className="font-semibold">
                                  {income.description}
                                </span>
                              </td>
                              <td className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900">
                                {income.amount}
                              </td>

                              <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500">
                                {format(new Date(income.date), "PP")}
                              </td>

                              <td className="cursor-pointer whitespace-nowrap p-4 text-sm">
                                <Form method="post">
                                  <input
                                    type="text"
                                    className={"hidden"}
                                    name={"incomeId"}
                                    value={income.id}
                                    readOnly={true}
                                  />
                                  <button
                                    type="submit"
                                    className="whitespace-nowrap p-4 text-sm"
                                    name={"intent"}
                                    value={"delete_income"}
                                  >
                                    Delete
                                  </button>
                                </Form>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Latest Transactions
              </h3>
              <span className="text-base font-normal text-gray-500">
                This is a list of latest transactions
              </span>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="outgoes"
                className="rounded-lg p-2 text-sm font-medium text-cyan-600 hover:bg-gray-100"
              >
                View all
              </Link>
              <Link
                to="outgoes/add"
                className="rounded-lg p-2 text-sm font-medium text-cyan-600 hover:bg-gray-100"
              >
                Add
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col">
            <div className="overflow-x-auto rounded-lg">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow sm:rounded-lg">
                  {data?.outgoes?.length === 0 ? (
                    <div className={"text text-center"}>
                      <div className={"text-underline text-zinc-500"}>
                        Great! You have no outgoes
                      </div>
                      <div>
                        <Link
                          className={
                            "rounded-lg p-1 text-sm font-medium text-cyan-600 hover:bg-gray-100"
                          }
                          to="outgoes/add"
                        >
                          Add your first outgo!
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Transaction
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Date &amp; Time
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {data?.outgoes?.map((outgo) => {
                          return (
                            <tr key={outgo.id}>
                              <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-900">
                                <span className="font-semibold">
                                  {outgo.description.length > 0
                                    ? outgo.description
                                    : outgo?.outgoCategory?.name}
                                </span>
                              </td>
                              <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500">
                                {format(new Date(outgo.date), "PP")}
                              </td>
                              <td className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900">
                                {outgo.amount}
                              </td>
                              <td>
                                <Form method="post">
                                  <input
                                    type="text"
                                    className={"hidden"}
                                    name={"outgoId"}
                                    value={outgo.id}
                                    readOnly={true}
                                  />
                                  <button
                                    type="submit"
                                    className="whitespace-nowrap p-4 text-sm"
                                    name={"intent"}
                                    value={"delete_outgo"}
                                  >
                                    Delete
                                  </button>
                                </Form>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8" />
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
