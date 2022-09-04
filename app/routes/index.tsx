import { Header } from "~/components/header";
import { useUser } from "~/utils";
import { Sidebar } from "~/components/sidebar";
import { LoaderFunction } from "@remix-run/node";
import { getTotalBalance } from "~/models/account.server";
import { requireUser } from "~/session.server";
import { useLoaderData } from "@remix-run/react";
import { Content } from "~/components/content";
import { Box } from "~/components/box";
import { useState } from "react";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);

  const balance = await getTotalBalance(user.email);
  console.log(13, balance);
  return balance || 0;
};

export default function Index() {
  const balance = useLoaderData() as any;
  return (
    <>
      <Content>
        <div>
          <Box mainText={balance} secondaryText={"Your total balance"} />
        </div>
      </Content>
    </>
  );
}
