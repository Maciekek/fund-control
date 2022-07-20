import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";

import { createNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import {
  createOutgoCategory,
  getOutgoCategory,
} from "~/models/outgoCategories.server";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/solid";

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  if (params.slug === "new") {
    return json({});
  }

  const userId = await requireUserId(request);
  const id = params.slug!;
  return getOutgoCategory({ userId, id });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const name = formData.get("name") as string;
  const subcategories = formData.getAll("subcategories").toString();

  await createOutgoCategory({
    name,
    subcategories,
    userId,
  });

  return redirect(`/categories`);
};

const generateId = () => {
  return Math.floor(Math.random() * 10000000).toString();
};

export default function NewNotePage() {
  const data = useLoaderData();
  const [subcategories, setSubcategories] = React.useState<
    {
      id: string;
      value: string;
    }[]
  >(
    !data.subcategories
      ? [{ id: generateId(), value: "" }]
      : data.subcategories.split(",").map((subcat: string) => {
          return {
            value: subcat,
            id: generateId(),
          };
        })
  );
  console.log(60, data);
  console.log(70, subcategories);
  return (
    <div
      className={
        "pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen"
      }
    >
      <div className="w-full rounded-lg bg-white shadow sm:max-w-screen-sm md:mt-0 xl:p-0">
        <div className="space-y-8 p-6 sm:p-8 lg:p-16">
          <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            New outgo category
          </h2>
          <form className="mt-8 space-y-6" method="post">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Category name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={data.name}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm"
                placeholder="Food"
              />
            </div>

            <h3 className="text-1xl lg:text-1xl border-b font-bold text-gray-900">
              Subcategories
            </h3>

            <div className="mb-2 block text-sm font-medium text-gray-900">
              Subcategories
            </div>
            {subcategories.map((subcategory, i) => {
              return (
                <div className={"flex items-center"} key={subcategory.id}>
                  <input
                    type="text"
                    name={`subcategories`}
                    defaultValue={subcategory.value}
                    className="block flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm"
                    placeholder="Food for home"
                  />

                  {subcategories.length === 1 ||
                  i === subcategories.length - 1 ? (
                    <div
                      className={"p-1"}
                      onClick={() => {
                        setSubcategories([
                          ...subcategories,
                          { id: generateId(), value: "" },
                        ]);
                      }}
                    >
                      <PlusCircleIcon className="h-5 w-5 cursor-pointer text-green-500" />
                    </div>
                  ) : (
                    <div
                      className={"p-1"}
                      onClick={() => {
                        setSubcategories(
                          subcategories.filter(
                            (subcat) => subcat.id !== subcategory.id
                          )
                        );
                      }}
                    >
                      <TrashIcon className="h-5 w-5 cursor-pointer text-red-500" />
                    </div>
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-600 px-5 py-3 text-center text-base font-medium text-white hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 sm:w-auto"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
