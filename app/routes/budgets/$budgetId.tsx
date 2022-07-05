import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData, Outlet } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Budget, Income } from "~/models/budget.server";

import { deleteBudget, getAllIncomes, getBudget } from "~/models/budget.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  budget: Budget;
  incomes?: Income[] | null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.budgetId, "noteId not found");

  const budget = await getBudget({ userId, id: params.budgetId });
  const incomes = await getAllIncomes(params.budgetId);
  console.log(22, incomes);
  if (!budget) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ budget, incomes: incomes || [] });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.budgetId, "budgetId not found");

  await deleteBudget({ userId, id: params.budgetId });

  return redirect("/budgets");
};

export default function NoteDetailsPage() {
  const data = useLoaderData() as LoaderData;
  console.log(40, data);
  return (
    <div className={"px-4 pt-6"}>
      <div>
        <div className={"flex items-center justify-between"}>
          <h3 className="text-2xl font-bold">{data.budget.name}</h3>
          <Form method="post">
            <button
              type="submit"
              className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Delete
            </button>
          </Form>
        </div>
        <hr className="my-4" />
      </div>
      <div
        className={
          "grid w-full grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3"
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
                          Date &amp; Time
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {data?.incomes?.map((income) => {
                        return (
                          <tr key={income.id}>
                            <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-900">
                              Payment from{" "}
                              <span className="font-semibold">
                                {income.description}
                              </span>
                            </td>
                            <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500">
                              Apr 23 ,2021
                            </td>
                            <td className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900">
                              {income.amount}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 ">
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
              <a
                href="#"
                className="rounded-lg p-2 text-sm font-medium text-cyan-600 hover:bg-gray-100"
              >
                View all
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col">
            <div className="overflow-x-auto rounded-lg">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow sm:rounded-lg">
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
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr>
                        <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-900">
                          Payment from{" "}
                          <span className="font-semibold">Bonnie Green</span>
                        </td>
                        <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500">
                          Apr 23 ,2021
                        </td>
                        <td className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900">
                          $2300
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
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
