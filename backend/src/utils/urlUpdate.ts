const uploadFilter: Record<string, string[]> = {
  images: [".jpg", ".jpeg", ".png"],
  documents: [".pdf", ".doc", ".docx"],
};

const SERVER_IP = process.env.IP || "localhost";
const SERVER_PORT = process.env.PORT || 8080;
const FILE_PATH = process.env.FILE_PATH || "uploads";

function getAllowedType(fieldValue: string): string {
  const extension = fieldValue.slice(fieldValue.lastIndexOf(".")).toLowerCase();
  for (const [type, extensions] of Object.entries(uploadFilter)) {
    if (extensions.includes(extension)) {
      return type;
    }
  }
  return "others"; // Default folder if no match is found
}

function updateField(fieldValue: string): string {
  const subfolder = getAllowedType(fieldValue);
  if (!subfolder) {
    throw new Error(`Unrecognized file extension: ${fieldValue}`);
  }
  return `http://${SERVER_IP}:${SERVER_PORT}/${FILE_PATH}/${subfolder}/${fieldValue}`;
}

export default function updateURL<T extends Record<string, any>>(
  itemOrItems: T | T[],
  fieldNames: (keyof T)[]
): T | T[] {
  const updateSingleItem = (item: T): T => {
    const updatedFields = fieldNames.reduce((acc, fieldName) => {
      const fieldValue = item[fieldName];
      if (fieldValue !== null && fieldValue !== undefined) {
        if (typeof fieldValue === "string") {
          acc[fieldName] = updateField(fieldValue) as T[keyof T];
        } else if (Array.isArray(fieldValue)) {
          acc[fieldName] = fieldValue.map((nestedItem: any) =>
            typeof nestedItem === "string"
              ? updateField(nestedItem)
              : updateURL(nestedItem, fieldNames)
          ) as T[keyof T];
        } else if (typeof fieldValue === "object") {
          acc[fieldName] = updateURL(fieldValue, fieldNames) as T[keyof T];
        }
      }
      return acc;
    }, {} as Partial<T>);

    // Recursively update nested objects that are not specified in fieldNames
    Object.keys(item).forEach((key) => {
      if (!fieldNames.includes(key as keyof T)) {
        const fieldValue = item[key];
        if (typeof fieldValue === "object" && fieldValue !== null) {
          updatedFields[key as keyof T] = updateURL(fieldValue, fieldNames) as T[keyof T];
        }
      }
    });

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
