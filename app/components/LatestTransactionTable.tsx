import React from "react";
import { Link } from "@remix-run/react";
import { format } from "date-fns";
import { Income, Outgo } from "@prisma/client";
import { TransactionType } from "~/models/types";
import { formatNumberToCurrency } from "~/helpers/number";

type LatestTransactionTableProps = {
  transactions: Income[] | Outgo[] | null | undefined;
  type: TransactionType;
};

const LatestTransactionTable = ({
  transactions,
  type,
}: LatestTransactionTableProps) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 ">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">{type}</h3>
          <span className="text-base font-normal text-gray-500">10 latest</span>
        </div>
        <div className="flex-shrink-0">
          <Link
            to={`${type === "Outgo" ? "outgoes/add" : "incomes/add"}`}
            className="rounded-lg p-2 text-sm font-medium text-cyan-600 hover:bg-gray-100"
          >
            Add
          </Link>
          <Link
            to={`transactions/${type}`}
            className="rounded-lg p-2 text-sm font-medium text-cyan-600 hover:bg-gray-100"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              {transactions && transactions.length === 0 ? (
                <div className={"text text-center"}>
                  <div className={"text-underline text-zinc-500"}>
                    You have no {type.toLowerCase()}
                  </div>
                  <div>
                    <Link
                      className={
                        "rounded-lg p-1 text-sm font-medium text-cyan-600 hover:bg-gray-100"
                      }
                      to="incomes/add"
                    >
                      Add your first {type.toLowerCase()}!
                    </Link>
                  </div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Date
                      </th>
                      {/*<th*/}
                      {/*  scope="col"*/}
                      {/*  className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"*/}
                      {/*>*/}
                      {/*  Actions*/}
                      {/*</th>*/}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {transactions!.map((transaction: any) => {
                      return (
                        <tr key={transaction.id}>
                          <td className="p-4 text-sm font-normal text-gray-900">
                            <span className="font-semibold">
                              {transaction.description}
                            </span>
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900">
                            {formatNumberToCurrency(transaction.amount)}
                          </td>

                          <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500">
                            {format(new Date(transaction.date), "PP")}
                          </td>

                          {/*<td className="cursor-pointer whitespace-nowrap p-4 text-sm">*/}
                          {/*  /!*<Form method="post">*!/*/}
                          {/*  /!*  <input*!/*/}
                          {/*  /!*    type="text"*!/*/}
                          {/*  /!*    className={"hidden"}*!/*/}
                          {/*  /!*    name={"transactionId"}*!/*/}
                          {/*  /!*    value={transaction.id}*!/*/}
                          {/*  /!*    readOnly={true}*!/*/}
                          {/*  /!*  />*!/*/}
                          {/*  /!*  <button*!/*/}
                          {/*  /!*    type="submit"*!/*/}
                          {/*  /!*    className="whitespace-nowrap p-4 text-sm"*!/*/}
                          {/*  /!*    name={"intent"}*!/*/}
                          {/*  /!*    value={"delete_transaction"}*!/*/}
                          {/*  /!*  >*!/*/}
                          {/*  /!*    Delete*!/*/}
                          {/*  /!*  </button>*!/*/}
                          {/*  /!*</Form>*!/*/}
                          {/*</td>*/}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { LatestTransactionTable };
