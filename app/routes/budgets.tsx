import { Outlet } from "@remix-run/react";
import { Content } from "~/components/content";

export default function Dashboard() {
  return (
    <Content>
      <>
        <Outlet />
      </>
    </Content>
  );
}
