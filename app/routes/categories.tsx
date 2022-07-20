import { Outlet } from "@remix-run/react";
import { Content } from "~/components/content";

export default function Categories() {
  return (
    <Content>
      <>
        <Outlet />
      </>
    </Content>
  );
}
