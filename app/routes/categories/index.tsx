import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  OutgoCategory,
  getAllOutgoCategories,
  deleteOutgoCategory,
} from "~/models/outgoCategories.server";
import { requireUser } from "~/session.server";
import invariant from "tiny-invariant";
import { deleteBudgetOutgo } from "~/models/budget.server";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import * as React from "react";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);

  const categories = await getAllOutgoCategories(user.email);
  console.log(15, categories);
  return json({ categories });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const intent = formData.get("intent");
  const categoryId = formData.get("categoryId") as string;

  if (intent === "delete_outgo_category") {
    await deleteOutgoCategory({ id: categoryId });

    return "/";
  }

  return redirect("/budgets/params.budgetId");
};

export default function OutgoCategoriesIndexPage() {
  const data = useLoaderData();
  console.log(16, data.categories);
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
              <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
                <Link
                  to="new"
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
                {data.categories?.length === 0 ? (
                  <div
                    className={"rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 "}
                  >
                    <div className="">
                      <div className="text text-center">
                        <div>
                          <Link
                            className="rounded-lg p-1 text-sm font-medium text-cyan-600 hover:bg-gray-100"
                            to="add"
                          >
                            Add your first category!
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
                          Category name
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium uppercase text-gray-500"
                        >
                          Subcategories
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
                      {data.categories.map((category: OutgoCategory) => {
                        return (
                          <tr className="hover:bg-gray-100" key={category.id}>
                            <td className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                              <div className="text-sm font-normal text-gray-500">
                                <div className="text-base font-semibold text-gray-900">
                                  {category.name}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap p-4 text-base font-normal text-gray-500">
                              {category.subcategories.split(",").join(", ")}
                            </td>
                            {/*<td className="whitespace-nowrap p-4 text-base font-medium text-gray-900"></td>*/}

                            <td className="mr-2 flex cursor-pointer items-center justify-end py-2 text-right ">
                              <Link to={category.id}>
                                <PencilIcon
                                  className={
                                    "mr-2 h-5 w-5 cursor-pointer text-gray-500"
                                  }
                                />
                              </Link>

                              <Form method="post" className={"inline-block"}>
                                <input
                                  type="text"
                                  className={"hidden"}
                                  name={"categoryId"}
                                  value={category.id}
                                  readOnly={true}
                                />
                                <button
                                  type="submit"
                                  name={"intent"}
                                  value={"delete_outgo_category"}
                                  data-modal-toggle="delete-user-modal"
                                  className="inline-flex cursor-pointer items-center py-2 text-center "
                                >
                                  <TrashIcon className="h-5 w-5 cursor-pointer text-red-500" />
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
