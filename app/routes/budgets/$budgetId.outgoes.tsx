import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import {
  deleteBudgetOutgo,
  getLatestOutgoes,
  Outgo,
} from "~/models/budget.server";
import { format } from "date-fns";
import type { OutgoCategory } from "@prisma/client";

type OutgoWithCategories = Outgo & { outgoCategory: OutgoCategory };

type LoaderData = {
  outgoes?: OutgoWithCategories[] | null;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  invariant(params.budgetId, "budgetId not found");

  const intent = formData.get("intent");
  console.log(26, "aaaa", params.budgetId);
  if (intent === "delete_outgo") {
    const outgoId = formData.get("outgoId") as string;
    await deleteBudgetOutgo({ id: outgoId, budgetId: params.budgetId });

    return "/";
  }

  return redirect("/budgets/params.budgetId");
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.budgetId, "noteId not found");

  const outgoes = await getLatestOutgoes(params.budgetId);

  return json<LoaderData>({
    outgoes: outgoes || [],
  });
};

export default function NewOutcome() {
  const data = useLoaderData() as LoaderData;

  return (
    <>
      <div className={"rounded-lg bg-white p-4 shadow"}>
        <div className="block items-center justify-between border-b border-gray-200 sm:flex lg:mt-1.5">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                All outgoes
              </h1>
            </div>
            <div className="sm:flex">
              <div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
                <form className="lg:pr-3" action="#" method="GET">
                  <label htmlFor="users-search" className="sr-only">
                    Search (not working)
                  </label>
                  <div className="relative mt-1 lg:w-64 xl:w-96">
                    <input
                      type="text"
                      name="email"
                      disabled
                      id="users-search"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm"
                      placeholder="Not implemented yet"
                    />
                  </div>
                </form>
              </div>
              <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
                <Link
                  to="add"
                  className="inline-flex w-1/2 items-center justify-center rounded-lg bg-cyan-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 sm:w-auto"
                >
                  <svg
                    className="-ml-1 mr-2 h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add outcome
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full pt-2 align-middle">
              <div className="overflow-hidden shadow">
                {data.outgoes?.length === 0 ? (
                  <div
                    className={"rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 "}
                  >
                    <div className="">
                      <div className="text text-center">
                        <div className="text-underline text-zinc-500">
                          Great! You have no outgoes
                        </div>
                        <div>
                          <Link
                            className="rounded-lg p-1 text-sm font-medium text-cyan-600 hover:bg-gray-100"
                            to="add"
                          >
                            Add your first outgo!
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <table className="min-w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium uppercase text-gray-500"
                        >
                          Outcome description
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium uppercase text-gray-500"
                        >
                          Amount
                        </th>

                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium uppercase text-gray-500"
                        >
                          Category
                        </th>

                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium uppercase text-gray-500"
                        >
                          Date
                        </th>

                        <th
                          scope="col"
                          className="p-4 text-right text-xs font-medium uppercase text-gray-500"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {data.outgoes?.map((outgo) => {
                        return (
                          <tr className="hover:bg-gray-100" key={outgo.id}>
                            <td className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                              <div className="text-sm font-normal text-gray-500">
                                <div className="text-base font-semibold text-gray-900">
                                  {outgo.description}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap p-4 text-base font-normal text-gray-500">
                              {outgo.amount}
                            </td>
                            <td className="whitespace-nowrap p-4 text-base font-normal text-gray-500">
                              <span className="font-medium">
                                {outgo.outgoCategory.name}
                              </span>
                              : {outgo.subcategory}
                            </td>
                            <td className="whitespace-nowrap p-4 text-base font-normal text-gray-500">
                              {format(new Date(outgo.date), "PP")}
                            </td>

                            <td className="max-w-xs	space-x-2 whitespace-nowrap p-4 text-right">
                              <Link
                                to={outgo.id}
                                className="inline-flex items-center rounded-lg bg-cyan-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200"
                              >
                                <svg
                                  className="mr-2 h-5 w-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Edit
                              </Link>

                              <Form method="post" className={"inline-block "}>
                                <input
                                  type="text"
                                  className={"hidden"}
                                  name={"outgoId"}
                                  value={outgo.id}
                                  readOnly={true}
                                />
                                <button
                                  type="submit"
                                  name={"intent"}
                                  value={"delete_outgo"}
                                  data-modal-toggle="delete-user-modal"
                                  className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300"
                                >
                                  <svg
                                    className="mr-2 h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
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
        {/*<div className="sticky bottom-0 right-0 w-full items-center border-t border-gray-200 bg-white p-4 sm:flex sm:justify-between">*/}
        {/*  <div className="mb-4 flex items-center sm:mb-0">*/}
        {/*    <a*/}
        {/*      href="#"*/}
        {/*      className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"*/}
        {/*    >*/}
        {/*      <svg*/}
        {/*        className="h-7 w-7"*/}
        {/*        fill="currentColor"*/}
        {/*        viewBox="0 0 20 20"*/}
        {/*        xmlns="http://www.w3.org/2000/svg"*/}
        {/*      >*/}
        {/*        <path*/}
        {/*          fillRule="evenodd"*/}
        {/*          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"*/}
        {/*          clipRule="evenodd"*/}
        {/*        />*/}
        {/*      </svg>*/}
        {/*    </a>*/}
        {/*    <a*/}
        {/*      href="#"*/}
        {/*      className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"*/}
        {/*    >*/}
        {/*      <svg*/}
        {/*        className="h-7 w-7"*/}
        {/*        fill="currentColor"*/}
        {/*        viewBox="0 0 20 20"*/}
        {/*        xmlns="http://www.w3.org/2000/svg"*/}
        {/*      >*/}
        {/*        <path*/}
        {/*          fillRule="evenodd"*/}
        {/*          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"*/}
        {/*          clipRule="evenodd"*/}
        {/*        />*/}
        {/*      </svg>*/}
        {/*    </a>*/}
        {/*    <span className="text-sm font-normal text-gray-500">*/}
        {/*      Showing <span className="font-semibold text-gray-900">1-20</span>{" "}*/}
        {/*      of <span className="font-semibold text-gray-900">2290</span>*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*  <div className="flex items-center space-x-3">*/}
        {/*    <a*/}
        {/*      href="#"*/}
        {/*      className="inline-flex flex-1 items-center justify-center rounded-lg bg-cyan-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200"*/}
        {/*    >*/}
        {/*      /!*<svg className="-ml-1 mr-1 h-5 w-5" "="" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>*!/*/}
        {/*      Previous*/}
        {/*    </a>*/}
        {/*    <a*/}
        {/*      href="#"*/}
        {/*      className="inline-flex flex-1 items-center justify-center rounded-lg bg-cyan-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200"*/}
        {/*    >*/}
        {/*      Next*/}
        {/*      <svg*/}
        {/*        className="-mr-1 ml-1 h-5 w-5"*/}
        {/*        fill="currentColor"*/}
        {/*        viewBox="0 0 20 20"*/}
        {/*        xmlns="http://www.w3.org/2000/svg"*/}
        {/*      >*/}
        {/*        <path*/}
        {/*          fillRule="evenodd"*/}
        {/*          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"*/}
        {/*          clipRule="evenodd"*/}
        {/*        />*/}
        {/*      </svg>*/}
        {/*    </a>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </>
  );
}
