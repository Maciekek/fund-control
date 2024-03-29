import { addOutgo, getOutgo, updateOutgo } from "~/models/budget.server";
import {
  ActionFunction,
  LoaderFunction,
  redirect,
  json,
} from "@remix-run/node";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { getAllOutgoCategories } from "~/models/outgoCategories.server";
import { getUser, getUserId } from "~/session.server";
import type { OutgoCategory } from "@prisma/client";
import { use } from "ast-types";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);
  const outgoCategories = await getAllOutgoCategories(user!.email);

  if (params.slug === "add") {
    return json({ outgoCategories });
  }

  const outgo = await getOutgo(params.slug!);

  return json({ outgo, outgoCategories });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const amount = formData.get("amount");
  const description = formData.get("description");
  const date = formData.get("date") as string;

  const outgoCategory = JSON.parse(formData.get("subcategory") as string);

  if (params.slug === "add") {
    await addOutgo({
      amount: Number(Number(amount).toPrecision(3)),
      description: description!.toString(),
      budgetId: params!.budgetId!,
      date: new Date(date!),
      outgoCategoryId: outgoCategory.categoryId,
      subcategory: outgoCategory.subcategory.toString(),
    });
  } else {
    await updateOutgo(params.slug!, {
      amount: Number(Number(amount).toPrecision(3)),
      description: description!.toString(),
      date: new Date(date),
      subcategory: outgoCategory.subcategory.toString(),
      outgoCategoryId: outgoCategory.categoryId,
    });
  }

  return redirect(`/budgets/${params!.budgetId!}`);
};

export default function NewOutcome() {
  const data = useLoaderData();

  const [date, setDate] = useState<string>(
    data.outgo?.date
      ? format(new Date(data.outgo?.date), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd")
  );

  useEffect(() => {
    document.addEventListener("wheel", function (event) {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    });

    if (localStorage.getItem("last-used-date")) {
      setDate(localStorage.getItem("last-used-date"));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("last-used-date", date);
  }, [date]);

  const getSubcategoryOptions = (outgoCategory: OutgoCategory) => {
    const subcategories = outgoCategory.subcategories.split(",");

    if (subcategories.length > 1) {
      return subcategories.map((subcat, i) => {
        return (
          <option
            key={subcat}
            selected={
              data.outgo?.outgoCategoryId === outgoCategory.id &&
              subcat === data.outgo.subcategory
            }
            value={JSON.stringify({
              categoryId: outgoCategory.id,
              subcategory: subcat,
            })}
            label={subcat}
          />
        );
      });
    }

    if (subcategories.length === 1) {
      return (
        <option
          key={subcategories[0]}
          label={subcategories[0]}
          value={JSON.stringify({
            categoryId: outgoCategory.id,
            subcategory: subcategories[0],
          })}
        />
      );
    }

    return;
  };
  console.log(99, data);
  return (
    <div
      className={
        "pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen"
      }
    >
      <div className="w-full rounded-lg bg-white shadow sm:max-w-screen-sm md:mt-0 xl:p-0">
        <div className="space-y-8 p-6 sm:p-8 lg:p-16">
          <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            Outcome
          </h2>
          <form
            className="mt-8 space-y-6"
            method="post"
            key={data.outgo?.id ?? "new"}
          >
            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Value
              </label>
              <input
                type="number"
                autoComplete={"off"}
                name="amount"
                step=".01"
                id="amount"
                defaultValue={data.outgo?.amount}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm"
                placeholder="2000"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Date
              </label>

              <input
                type="date"
                name={"date"}
                value={date}
                defaultValue={data.outgo?.date}
                onChange={(event) => {
                  console.log(82, event.target.value);
                  setDate(event.target.value);
                }}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Category
              </label>
              <select
                name={"subcategory"}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm"
              >
                {data.outgoCategories.map((category: OutgoCategory) => {
                  return (
                    <optgroup label={category.name} key={category.name}>
                      {getSubcategoryOptions(category)}
                    </optgroup>
                  );
                })}
              </select>
            </div>
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm text-gray-900"
              >
                Name (Optional)
              </label>
              <input
                type="text"
                name="description"
                autoComplete={"off"}
                defaultValue={data.outgo?.description}
                id="description"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm"
                placeholder="Description"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-600 px-5 py-3 text-center text-base font-medium text-white hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 sm:w-auto"
            >
              {data.outgo ? "Update" : "Create"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
