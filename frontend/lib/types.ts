export interface User {
  name: string;
  email: string;
}
export type Transaction = {
  id: number | string;
  type: "income" | "expense";
  amount: number | string;
  category: string;
  description?: string | null;
  date: string;
};
