const uploadFilter: Record<string, string[]> = {
  images: [".jpg", ".jpeg", ".png"],
  documents: [".pdf", ".doc", ".docx"],
};

const SERVER_IP = process.env.IP || "localhost";
const SERVER_PORT = process.env.PORT || 8080;
const FILE_PATH = process.env.FILE_PATH;

function getAllowedType(fieldValue: string): string {
  const extension = fieldValue.slice(fieldValue.lastIndexOf(".")).toLowerCase();
  for (const [type, extensions] of Object.entries(uploadFilter)) {
    if (extensions.includes(extension)) {
      return type;
    }
  }
  return "others"; // Default folder if no match is found
}

export function updateURL<T extends Record<string, any>>(itemOrItems: T | T[], fieldNames: (keyof T)[]): T | T[] {
  const updateSingleItem = (item: T): T => {
    const updatedFields = fieldNames.reduce((acc, fieldName) => {
      const fieldValue = item[fieldName] as unknown as string;
      if (fieldValue !== null && fieldValue !== undefined) {
        const subfolder = getAllowedType(fieldValue);
        if (!subfolder) {
          throw new Error(`Unrecognized file extension: ${fieldValue}`);
        }
        acc[fieldName] = `http://${SERVER_IP}:${SERVER_PORT}/${FILE_PATH}/${subfolder}/${fieldValue}` as T[keyof T];
      }
      return acc;
    }, {} as Partial<T>);

    return {
      ...item,
      ...updatedFields,
    };
  };

  if (Array.isArray(itemOrItems)) {
    return itemOrItems.map(updateSingleItem);
  } else {
    return updateSingleItem(itemOrItems);
  }
}
