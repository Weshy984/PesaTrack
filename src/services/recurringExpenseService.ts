import { supabase } from "../lib/supabase";
import type { RecurringExpense } from "../types/recurringExpense";

// Fetch all recurring expenses belonging to the logged-in user
export async function getRecurringExpenses(): Promise<RecurringExpense[]> {
  const { data, error } = await supabase
    .from("recurring_expenses")
    .select("*")
    .order("next_due_date", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((expense) => ({
    ...expense,
    amount: Number(expense.amount),
  })) as RecurringExpense[];
}

// Create a recurring expense
export async function createRecurringExpense(input: {
  title: string;
  amount: number;
  category: string;
  startDate: string;
  endDate: string | null;
}): Promise<RecurringExpense> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("You must be logged in.");

  const { data, error } = await supabase
    .from("recurring_expenses")
    .insert({
      user_id: user.id,
      title: input.title,
      amount: input.amount,
      category: input.category,
      frequency: "monthly",
      start_date: input.startDate,
      next_due_date: input.startDate,
      end_date: input.endDate,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    amount: Number(data.amount),
  } as RecurringExpense;
}

// Pause or resume a recurring expense
export async function updateRecurringExpenseStatus(
  expenseId: string,
  isActive: boolean
): Promise<void> {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("You must be logged in.");

  const { error } = await supabase
    .from("recurring_expenses")
    .update({ is_active: isActive })
    .eq("id", expenseId)
    .eq("user_id", user.id);

  if (error) throw error;
}

// Delete a recurring expense
export async function deleteRecurringExpense(
  expenseId: string
): Promise<void> {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("You must be logged in.");

  const { error } = await supabase
    .from("recurring_expenses")
    .delete()
    .eq("id", expenseId)
    .eq("user_id", user.id);

  if (error) throw error;
}