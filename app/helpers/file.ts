import { csv } from "csvtojson";

export const readFile = (file: File, onRead: (file: string) => void) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.currentTarget.result;

    onRead(content);
  };

  reader.readAsText(file);
};

export const getJsonFromCsvFile = (file: File): Promise<object[]> => {
  return new Promise<object[]>((resolve, reject) => {
    readFile(file, (content: string) => {
      csv()
        .fromString(content)
        .then((jsonObj: object[]) => {
          console.log(jsonObj);
          resolve(jsonObj);
        });
    });
  });
};
