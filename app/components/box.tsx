import { ReactNode } from "react";

type BoxProps = {
  mainText: string;
  secondaryText?: string | ReactNode;
  editUrl?: string;
};
const Box = ({ mainText, secondaryText }: BoxProps) => {
  return (
    <div className="w-1/5 rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
            {mainText}
          </span>
          <h3 className="text-base font-normal text-gray-500">
            {secondaryText ?? null}
          </h3>
        </div>

        {/*<div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-green-500">*/}
        {/*  14.6%*/}
        {/*  <svg*/}
        {/*    className="h-5 w-5"*/}
        {/*    fill="currentColor"*/}
        {/*    viewBox="0 0 20 20"*/}
        {/*    xmlns="http://www.w3.org/2000/svg"*/}
        {/*  >*/}
        {/*    <path*/}
        {/*      fill-rule="evenodd"*/}
        {/*      d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"*/}
        {/*      clip-rule="evenodd"*/}
        {/*    ></path>*/}
        {/*  </svg>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export { Box };
