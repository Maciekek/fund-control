import { useEffect, useState } from "react";
import Modal from "~/components/Modal";
import { Table } from "~/components/Table";
import { OutgoCategory } from "@prisma/client";

interface IModalProps {
  statements: object[];
  categories?: OutgoCategory[];
}

export const ImportAccountStatementModal = ({
  statements,
  categories,
}: IModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
    }
  }, [statements]);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
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
            ]}
            rowRenderer={() => {
              return statements.map((statement, i) => (
                <tr key={i}>
                  <td className={"p-2 text-center"}>
                    {statement["Data transakcji"]}
                  </td>
                  <td className={"p-2 text-center"}>
                    {statement["Uznania"] ? "Income" : "Outcome"}
                  </td>
                  <td className={"p-2 text-center"}>{statement["Opis"]}</td>
                  <td className={"p-2 text-center"}>
                    {statement["Uznania"]
                      ? statement["Uznania"]
                      : statement["Obciążenia"]}
                  </td>
                  <td className={"p-2 text-center"}>
                    <select
                      name={"subcategory"}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm"
                    >
                      A
                      {categories!.map((category: OutgoCategory) => {
                        return (
                          <optgroup label={category.name} key={category.name}>
                            {getSubcategoryOptions(category)}
                          </optgroup>
                        );
                      })}
                    </select>
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
