import { formatNumberToCurrency } from "~/helpers/number";
import { da } from "date-fns/locale";
import { Outgo } from "@prisma/client";

type TopTableProps = {
  total: number;
  data: { [key: string]: { total: number; subcategorySummary: any } };
};

const TopTable = ({ data, total }: TopTableProps) => {
  const sortedData = Object.keys(data)
    .map((key) => ({
      key,
      value: data[key].total,
      subcategorySummary: data[key].subcategorySummary,
    }))
    .sort((a, b) => a.value - b.value);
  console.log(15, data);
  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 ">
      <h3 className="mb-10 text-xl font-bold leading-none text-gray-900">
        Outgoes summary
      </h3>
      <div className="block w-full overflow-x-auto">
        <table className="w-full border-collapse items-center bg-transparent">
          <thead>
            <tr>
              <th className="whitespace-nowrap border-l-0 border-r-0 bg-gray-50 px-4 py-3 text-left align-middle text-xs font-semibold uppercase text-gray-700">
                Category
              </th>
              <th className="whitespace-nowrap border-l-0 border-r-0 bg-gray-50 px-4 py-3 text-left align-middle text-xs font-semibold uppercase text-gray-700">
                Amount
              </th>
              <th className="min-w-140-px whitespace-nowrap border-l-0 border-r-0 bg-gray-50 px-4 py-3 text-left align-middle text-xs font-semibold uppercase text-gray-700">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedData.map(
              (data: {
                key: string;
                value: number;
                subcategorySummary: any;
              }) => {
                const share = ((data.value / total) * 100).toFixed(2);
                console.log(39, data, sortedData);
                return (
                  <>
                    <tr className="text-gray-500" key={data.key}>
                      <th className="whitespace-nowrap border-t-0 p-4 px-4 text-left align-middle text-sm font-bold">
                        {data.key}
                      </th>
                      <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs font-medium text-gray-900">
                        {formatNumberToCurrency(data.value)}
                      </td>
                      <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs">
                        <div className="flex items-center">
                          <span className="mr-2 text-xs font-medium">
                            {share}%
                          </span>
                          <div className="relative w-full">
                            <div className="h-2 w-full rounded-sm bg-gray-200">
                              <div
                                className="h-2 rounded-sm bg-cyan-600"
                                style={{ width: `${share}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {Object.keys(data.subcategorySummary).map(
                      (subcategoryKey) => {
                        return (
                          <tr className="text-gray-500" key={subcategoryKey}>
                            <th className="whitespace-nowrap border-t-0 p-4 px-4 pl-10 text-left align-middle text-sm font-normal">
                              {subcategoryKey}
                            </th>
                            <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs font-medium text-gray-900">
                              {formatNumberToCurrency(
                                data.subcategorySummary[subcategoryKey]
                              )}
                            </td>
                            <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs">
                              {/*<div className="flex items-center">*/}
                              {/*  <span className="mr-2 text-xs font-medium">{share}%</span>*/}
                              {/*  <div className="relative w-full">*/}
                              {/*    <div className="h-2 w-full rounded-sm bg-gray-200">*/}
                              {/*      <div*/}
                              {/*        className="h-2 rounded-sm bg-cyan-600"*/}
                              {/*        style={{ width: `${share}%` }}*/}
                              {/*      />*/}
                              {/*    </div>*/}
                              {/*  </div>*/}
                              {/*</div>*/}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { TopTable };
