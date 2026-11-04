
export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  transaction_date: string;
  created_at: string;
};
