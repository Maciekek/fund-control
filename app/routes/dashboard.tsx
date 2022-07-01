import { Header } from "~/components/header";
import { useUser } from "~/utils";
import { Sidebar } from "~/components/sidebar";
import { LoaderFunction } from "@remix-run/node";
import { getTotalBalance } from "~/models/account.server";
import { requireUser } from "~/session.server";
import { useLoaderData } from "@remix-run/react";
import { Content } from "~/components/content";
import { Box } from "~/components/box";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);

  const balance = await getTotalBalance(user.email);
  console.log(13, balance);
  return balance;
};

export default function Dashboard() {
  const user = useUser();
  const balance = useLoaderData() as any;
  console.log(23, balance);
  return (
    <>
      <Header user={user} />
      <Sidebar user={user} />
      {/*<div className={'flex h-full min-h-screen flex-col'}>*/}
      <Content>
        <div>
          <Box mainText={balance} secondaryText={"Your total balance"} />
        </div>
      </Content>
    </>
  );
}
