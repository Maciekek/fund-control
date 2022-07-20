type TopTableProps = {
  total: number;
  data: { [key: string]: number };
};

const TopTable = ({ data, total }: TopTableProps) => {
  console.log(7, data, total);
  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 ">
      <h3 className="mb-10 text-xl font-bold leading-none text-gray-900">
        Acquisition Overview
      </h3>
      <div className="block w-full overflow-x-auto">
        <table className="w-full border-collapse items-center bg-transparent">
          <thead>
            <tr>
              <th className="whitespace-nowrap border-l-0 border-r-0 bg-gray-50 px-4 py-3 text-left align-middle text-xs font-semibold uppercase text-gray-700">
                Top Channels
              </th>
              <th className="whitespace-nowrap border-l-0 border-r-0 bg-gray-50 px-4 py-3 text-left align-middle text-xs font-semibold uppercase text-gray-700">
                Users
              </th>
              <th className="min-w-140-px whitespace-nowrap border-l-0 border-r-0 bg-gray-50 px-4 py-3 text-left align-middle text-xs font-semibold uppercase text-gray-700" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Object.keys(data).map((key: string) => {
              const share = ((data[key] / total) * 100).toFixed(2);
              return (
                <tr className="text-gray-500" key={key}>
                  <th className="whitespace-nowrap border-t-0 p-4 px-4 text-left align-middle text-sm font-normal">
                    {key}
                  </th>
                  <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs font-medium text-gray-900">
                    {data[key]}
                  </td>
                  <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs">
                    <div className="flex items-center">
                      <span className="mr-2 text-xs font-medium">{share}%</span>
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
              );
            })}

            {/*<tr className="text-gray-500">*/}
            {/*  <th className="whitespace-nowrap border-t-0 p-4 px-4 text-left align-middle text-sm font-normal">*/}
            {/*    Referral*/}
            {/*  </th>*/}
            {/*  <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs font-medium text-gray-900">*/}
            {/*    4,025*/}
            {/*  </td>*/}
            {/*  <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs">*/}
            {/*    <div className="flex items-center">*/}
            {/*      <span className="mr-2 text-xs font-medium">24%</span>*/}
            {/*      <div className="relative w-full">*/}
            {/*        <div className="h-2 w-full rounded-sm bg-gray-200">*/}
            {/*          <div*/}
            {/*            className="h-2 rounded-sm bg-orange-300"*/}
            {/*            style={{ width: "30%" }}*/}
            {/*          />*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </td>*/}
            {/*</tr>*/}
            {/*<tr className="text-gray-500">*/}
            {/*  <th className="whitespace-nowrap border-t-0 p-4 px-4 text-left align-middle text-sm font-normal">*/}
            {/*    Direct*/}
            {/*  </th>*/}
            {/*  <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs font-medium text-gray-900">*/}
            {/*    3,105*/}
            {/*  </td>*/}
            {/*  <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs">*/}
            {/*    <div className="flex items-center">*/}
            {/*      <span className="mr-2 text-xs font-medium">18%</span>*/}
            {/*      <div className="relative w-full">*/}
            {/*        <div className="h-2 w-full rounded-sm bg-gray-200">*/}
            {/*          <div*/}
            {/*            className="h-2 rounded-sm bg-teal-400"*/}
            {/*            style={{ width: "30%" }}*/}
            {/*          ></div>*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </td>*/}
            {/*</tr>*/}
            {/*<tr className="text-gray-500">*/}
            {/*  <th className="whitespace-nowrap border-t-0 p-4 px-4 text-left align-middle text-sm font-normal">*/}
            {/*    Social*/}
            {/*  </th>*/}
            {/*  <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs font-medium text-gray-900">*/}
            {/*    1251*/}
            {/*  </td>*/}
            {/*  <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs">*/}
            {/*    <div className="flex items-center">*/}
            {/*      <span className="mr-2 text-xs font-medium">12%</span>*/}
            {/*      <div className="relative w-full">*/}
            {/*        <div className="h-2 w-full rounded-sm bg-gray-200">*/}
            {/*          <div*/}
            {/*            className="h-2 rounded-sm bg-pink-600"*/}
            {/*            style={{ width: "30%" }}*/}
            {/*          ></div>*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </td>*/}
            {/*</tr>*/}
            {/*<tr className="text-gray-500">*/}
            {/*  <th className="whitespace-nowrap border-t-0 p-4 px-4 text-left align-middle text-sm font-normal">*/}
            {/*    Other*/}
            {/*  </th>*/}
            {/*  <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs font-medium text-gray-900">*/}
            {/*    734*/}
            {/*  </td>*/}
            {/*  <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs">*/}
            {/*    <div className="flex items-center">*/}
            {/*      <span className="mr-2 text-xs font-medium">9%</span>*/}
            {/*      <div className="relative w-full">*/}
            {/*        <div className="h-2 w-full rounded-sm bg-gray-200">*/}
            {/*          <div*/}
            {/*            className="h-2 rounded-sm bg-indigo-600"*/}
            {/*            style={{ width: "30%" }}*/}
            {/*          ></div>*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </td>*/}
            {/*</tr>*/}
            {/*<tr className="text-gray-500">*/}
            {/*  <th className="whitespace-nowrap border-t-0 p-4 pb-0 text-left align-middle text-sm font-normal">*/}
            {/*    Email*/}
            {/*  </th>*/}
            {/*  <td className="whitespace-nowrap border-t-0 p-4 pb-0 align-middle text-xs font-medium text-gray-900">*/}
            {/*    456*/}
            {/*  </td>*/}
            {/*  <td className="whitespace-nowrap border-t-0 p-4 pb-0 align-middle text-xs">*/}
            {/*    <div className="flex items-center">*/}
            {/*      <span className="mr-2 text-xs font-medium">7%</span>*/}
            {/*      <div className="relative w-full">*/}
            {/*        <div className="h-2 w-full rounded-sm bg-gray-200">*/}
            {/*          <div*/}
            {/*            className="h-2 rounded-sm bg-purple-500"*/}
            {/*            style={{ width: "30%" }}*/}
            {/*          ></div>*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </td>*/}
            {/*</tr>*/}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { TopTable };
