const SERVER_IP = process.env.IP || "localhost";
const SERVER_PORT = process.env.PORT || 8080;

export function updateURL<T extends Record<string, any>>(itemOrItems: T | T[], fieldName: keyof T): T | T[] {
  const updateSingleItem = (item: T): T => ({
    ...item,
    [fieldName]: `http://${SERVER_IP}:${SERVER_PORT}${item[fieldName]}`,
  });

  if (Array.isArray(itemOrItems)) {
    return itemOrItems.map(updateSingleItem);
  } else {
    return updateSingleItem(itemOrItems);
  }
}
