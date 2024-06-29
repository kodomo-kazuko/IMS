import { allowedFileTypes } from "../types/types";

const SERVER_IP = process.env.IP || "localhost";
const SERVER_PORT = process.env.PORT || 8080;
const FILE_PATH = process.env.FILE_PATH;

export function updateURL<T extends Record<string, any>>(itemOrItems: T | T[], fieldName: keyof T, allowedTypes: allowedFileTypes): T | T[] {
  const subfolder = allowedTypes;
  const updateSingleItem = (item: T): T => ({
    ...item,
    [fieldName]: `http://${SERVER_IP}:${SERVER_PORT}/${FILE_PATH}/${subfolder}/${item[fieldName]}`,
  });

  if (Array.isArray(itemOrItems)) {
    return itemOrItems.map(updateSingleItem);
  } else {
    return updateSingleItem(itemOrItems);
  }
}
