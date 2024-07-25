const uploadFilter: Record<string, string[]> = {
  images: [".jpg", ".jpeg", ".png"],
  documents: [".pdf", ".doc", ".docx"],
};

const SERVER_IP = process.env.IP || "localhost";
const SERVER_PORT = process.env.PORT || 8080;
const FILE_PATH = process.env.FILE_PATH || "uploads";

function getAllowedType(fieldValue: string): string | null {
  const extension = fieldValue.slice(fieldValue.lastIndexOf(".")).toLowerCase();
  for (const [type, extensions] of Object.entries(uploadFilter)) {
    if (extensions.includes(extension)) {
      return type;
    }
  }
  return null;
}

function updateField(fieldValue: string): string {
  const subfolder = getAllowedType(fieldValue);
  if (!subfolder) {
    return fieldValue;
  }
  return `http://${SERVER_IP}:${SERVER_PORT}/${FILE_PATH}/${subfolder}/${fieldValue}`;
}

function isDateField(value: any): boolean {
  return value instanceof Date || (typeof value === "string" && !isNaN(Date.parse(value)));
}

export default function updateURL<T extends Record<string, any>>(
  itemOrItems: T | T[],
  fieldNames: (keyof T)[],
  fieldsToIgnore: (keyof T)[] = []
): T | T[] {
  const updateSingleItem = (item: T): T => {
    const updatedFields = fieldNames.reduce((acc, fieldName) => {
      if (fieldsToIgnore.includes(fieldName) || isDateField(item[fieldName])) {
        acc[fieldName] = item[fieldName];
        return acc;
      }

      const fieldValue = item[fieldName];
      if (fieldValue !== null && fieldValue !== undefined) {
        if (typeof fieldValue === "string") {
          const updatedValue = updateField(fieldValue);
          acc[fieldName] = updatedValue as T[keyof T];
        } else if (Array.isArray(fieldValue)) {
          acc[fieldName] = fieldValue.map((nestedItem: any) =>
            typeof nestedItem === "string"
              ? updateField(nestedItem)
              : updateURL(nestedItem, fieldNames, fieldsToIgnore)
          ) as T[keyof T];
        } else if (typeof fieldValue === "object" && !Array.isArray(fieldValue)) {
          acc[fieldName] = updateURL(fieldValue, fieldNames, fieldsToIgnore) as T[keyof T];
        } else {
          acc[fieldName] = fieldValue;
        }
      } else {
        acc[fieldName] = fieldValue;
      }
      return acc;
    }, {} as Partial<T>);

    Object.keys(item).forEach((key) => {
      if (!fieldNames.includes(key as keyof T) && !fieldsToIgnore.includes(key as keyof T)) {
        const fieldValue = item[key];
        if (typeof fieldValue === "object" && fieldValue !== null && !isDateField(fieldValue)) {
          updatedFields[key as keyof T] = updateURL(
            fieldValue,
            fieldNames,
            fieldsToIgnore
          ) as T[keyof T];
        } else {
          updatedFields[key as keyof T] = fieldValue;
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
