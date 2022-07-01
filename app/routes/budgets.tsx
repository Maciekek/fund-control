import { Header } from "~/components/header";
import { useUser } from "~/utils";
import { Sidebar } from "~/components/sidebar";
import { LoaderFunction } from "@remix-run/node";
import { requireUser } from "~/session.server";
import { Link, useLoaderData, Outlet } from "@remix-run/react";
import { Content } from "~/components/content";
import { Box } from "~/components/box";
import { getAllBudgets } from "~/models/budget.server";

type Budgets = {
  name: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);

  const budgets = await getAllBudgets(user.email);
  console.log(13, budgets);
  return budgets;
};

export default function Dashboard() {
  const user = useUser();
  // const budgets = useLoaderData() as Budgets[];
  // console.log(23, budgets);
  return (
    <>
      <Header user={user} />
      <Sidebar user={user} />
      <Content>
        <>
          <Outlet />
        </>
      </Content>
    </>
  );
}
