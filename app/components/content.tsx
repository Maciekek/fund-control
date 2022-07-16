import { ReactChild, useState } from "react";
import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";
import { useUser } from "~/utils";

type ContentProps = {
  children: ReactChild;
};

const Content = ({ children }: ContentProps) => {
  const user = useUser();

  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  return (
    <>
      <Header onMenuClick={() => setIsMenuVisible(!isMenuVisible)} />
      <Sidebar user={user} isVisibleOnMobile={isMenuVisible} />

      <div
        id="main-content"
        className="relative h-full overflow-y-auto bg-gray-50 pt-16 lg:ml-64"
      >
        <main>
          <div className={"px-4 pt-6"}>{children}</div>
        </main>
      </div>
    </>
  );
};

export { Content };
