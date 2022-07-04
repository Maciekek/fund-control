import { Box } from "~/components/box";
import { LoaderFunction } from "@remix-run/node";
import { requireUser } from "~/session.server";
import { getAllBudgets } from "~/models/budget.server";
import { Link, useLoaderData } from "@remix-run/react";

type Budgets = {
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

  return (
    <Box
      mainText={budgets.length === 0 ? "You have no budgets" : "masz cos"}
      secondaryText={
        budgets.length === 0 ? <Link to={"new"}>Create new budget</Link> : null
      }
    />
  );
}
