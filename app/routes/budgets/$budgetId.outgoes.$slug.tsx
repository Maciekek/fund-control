import {
  addOutgo,
  getOutgo,
  updateOutgo,
} from "~/models/budget.server";
import {
  ActionFunction,
  LoaderFunction,
  redirect,
  json,
} from "@remix-run/node";
import { format } from "date-fns";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request, params }) => {
  console.log(7, params);
  if (params.slug === "add") {
    console.log(15, "mam nulla");
    return json({});
  }

  const outgo = await getOutgo(params.slug!);
  console.log(14, outgo);
  return json({ outgo });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const amount = formData.get("amount");
  const description = formData.get("description");
  const date = formData.get("date") as string;

  console.log(22, params);
  if (params.slug === "add") {
    await addOutgo({
      amount: Number(amount),
      description: description!.toString(),
      budgetId: params!.budgetId!,
      date: new Date(date!),
    });
  } else {
    await updateOutgo(params.slug!, {
      amount: Number(amount),
      description: description!.toString(),
      date: new Date(date),
    });
  }

  return redirect(`/budgets/${params!.budgetId!}`);
};

export default function NewOutcome() {
  const data = useLoaderData();
  console.log(43, "dupa");
  console.log(44, data);
  console.log(45, data.outgo?.date);
  const [date, setDate] = useState<string>(
    data.outgo?.date
      ? format(new Date(data.outgo?.date), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd")
  );
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
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Name
              </label>
              <input
                type="text"
                name="description"
                defaultValue={data.outgo?.description}
                id="description"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm"
                placeholder="Description"
                required
              />
            </div>

            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Value
              </label>
              <input
                type="number"
                name="amount"
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
