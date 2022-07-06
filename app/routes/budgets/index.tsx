import { Box } from "~/components/box";
import { LoaderFunction } from "@remix-run/node";
import { requireUser } from "~/session.server";
import { getAllBudgets } from "~/models/budget.server";
import { Link, useLoaderData } from "@remix-run/react";

type Budgets = {
  id: string;
  name: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);

  const budgets = await getAllBudgets(user.email);
  console.log(13, budgets);
  return budgets;
};

export default function BudgetIndexPage() {
  const budgets = useLoaderData() as Budgets[];

  if (budgets.length === 0) {
    return (
      <Box
        mainText={"You have no budgets"}
        secondaryText={
          budgets.length === 0 ? (
            <Link to={"new"}>Create new budget</Link>
          ) : null
        }
      />
    );
  }

  return (
    <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <>
        {budgets.map((budget, i) => {
          return (
            <Box
              link={budget.id}
              key={i}
              mainText={budget.name}
              secondaryText={""}
            />
          );
        })}
        <Box secondaryText={<Link to={"new"}>Create new budget</Link>} />
      </>
    </div>
  );
}
