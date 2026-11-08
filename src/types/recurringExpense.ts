export type RecurringFrequency = "monthly";

export type RecurringExpense = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  frequency: RecurringFrequency;
  start_date: string;
  next_due_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
};