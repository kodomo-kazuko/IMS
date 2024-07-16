export type AccountType = "employee" | "company" | "student" | "mentor";
export type allowedFileTypes = "images" | "documents";
type SortOrder = "asc" | "desc";
export interface sortOrder {
  order: SortOrder;
}
