import { ReactChild } from "react";

type ContentProps = {
  children: ReactChild;
};
const Content = ({ children }: ContentProps) => {
  return (
    <div
      id="main-content"
      className="relative h-full overflow-y-auto bg-gray-50 pt-16 lg:ml-64"
    >
      <main>
        <div className={"px-4 pt-6"}>{children}</div>
      </main>
    </div>
  );
};

export { Content };
