import { ReactNode } from "react";

interface ITableProps {
  headers: string[];
  rowRenderer: () => ReactNode;
}
export const Table = ({ headers, rowRenderer }: ITableProps) => {
  return (
    <table className="min-w-full table-fixed divide-y divide-gray-200">
      <thead className="sticky top-0 bg-gray-100">
        <tr>
          {headers.map((header) => (
            <th
              scope="col"
              className="p-4 text-xs font-medium uppercase text-gray-500"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="w-100  divide-y divide-gray-200 bg-white ">
        {rowRenderer()}
      </tbody>
    </table>
  );
};
