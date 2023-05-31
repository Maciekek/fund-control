import { useEffect, useState } from "react";
import Modal from "~/components/Modal";
import { Table } from "~/components/Table";
import { OutgoCategory } from "@prisma/client";
import { TrashIcon } from "@heroicons/react/solid";
import * as React from "react";

interface IModalProps {
  statements: object[];
  categories?: OutgoCategory[];
  onSubmit: (data: any) => void;
}

export const ImportAccountStatementModal = ({
  categories,
  onSubmit,
  statements,
}: IModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tempStatements, setTempStatements] = useState(statements);

  const getSubcategoryOptions = (outgoCategory: OutgoCategory) => {
    const subcategories = outgoCategory.subcategories.split(",");
    if (subcategories.length > 1) {
      return subcategories.map((subcat, i) => {
        return (
          <option
            key={subcat}
            value={JSON.stringify({
              categoryId: outgoCategory.id,
              subcategory: subcat,
            })}
            label={subcat}
          />
        );
      });
    }

    if (subcategories.length === 1) {
      return (
        <option
          key={subcategories[0]}
          label={subcategories[0]}
          value={JSON.stringify({
            categoryId: outgoCategory.id,
            subcategory: subcategories[0],
          })}
        />
      );
    }

    return;
  };

  useEffect(() => {
    if (statements.length > 0) {
      setIsModalOpen(true);
      setTempStatements(statements);
    }
  }, [statements]);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onSubmit={() => {
          console.log(64, "submit");
          setIsModalOpen(false);
          onSubmit(tempStatements);
        }}
      >
        <div className={"h-[calc(100vh_-_320px)] overflow-auto"}>
          <Table
            headers={[
              "Transaction date",
              "Type",
              "Description",
              "Amount",
              "Category",
              "Actions",
            ]}
            rowRenderer={() => {
              return tempStatements.map((statement: any, i) => (
                <tr key={i}>
                  <td className={"p-2 text-center"}>{statement.date}</td>
                  <td className={"p-2 text-center"}>
                    {statement.amount > 0 ? "Income" : "Outcome"}
                  </td>
                  <td className={"p-2 text-center"}>{statement.description}</td>
                  <td className={"p-2 text-center"}>{statement.amount}</td>
                  <td className={"p-2 text-center"}>
                    {statement.amount < 0 ? (
                      <select
                        name={"subcategory"}
                        onChange={(e) => {
                          console.log(99, statement);
                          console.log(
                            103,
                            "change",
                            JSON.parse(e.target.value),
                            i
                          );

                          const s = statements;
                          s[i] = {
                            ...s[i],
                            outgoCategoryId: JSON.parse(e.target.value)
                              .categoryId,
                            subcategory: JSON.parse(e.target.value).subcategory,
                          };
                          console.log(114, s);
                          setTempStatements([...s]);
                        }}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm"
                      >
                        {categories!.map((category: OutgoCategory) => {
                          return (
                            <optgroup label={category.name} key={category.name}>
                              {getSubcategoryOptions(category)}
                            </optgroup>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className={"p-2 text-center"}>
                    <button
                      title={"Delete"}
                      className="inline-flex cursor-pointer items-center py-2 text-center"
                      onClick={() => {
                        setTempStatements([
                          ...tempStatements.slice(0, i),
                          ...tempStatements.slice(i + 1),
                        ]);
                      }}
                    >
                      <TrashIcon className="h-5 w-5 cursor-pointer text-red-500" />
                    </button>
                  </td>
                </tr>
              ));
            }}
          ></Table>
        </div>
      </Modal>
    </>
  );
};
