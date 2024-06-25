export interface ReturnJSON<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
