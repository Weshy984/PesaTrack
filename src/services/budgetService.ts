import { supabase } from "../lib/supabase";
import type { Budget } from "../types/budget";

export async function getBudgets(budgetMonth: string) {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("budget_month", budgetMonth)
    .order("category", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((budget) => ({
    ...budget,
    amount: Number(budget.amount),
  })) as Budget[];
}

export async function createBudget(input: {
  category: string;
  amount: number;
  budgetMonth: string;
}) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("You must be signed in to create a budget.");
  }

  const { data, error } = await supabase
    .from("budgets")
    .insert({
      user_id: user.id,
      category: input.category,
      amount: input.amount,
      budget_month: input.budgetMonth,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...data,
    amount: Number(data.amount),
  } as Budget;
}

export async function updateBudget(
  budgetId: string,
  input: {
    category: string;
    amount: number;
    budgetMonth: string;
  }
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("You must be signed in to update a budget.");
  }

  const { data, error } = await supabase
    .from("budgets")
    .update({
      category: input.category,
      amount: input.amount,
      budget_month: input.budgetMonth,
    })
    .eq("id", budgetId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...data,
    amount: Number(data.amount),
  } as Budget;
}

export async function deleteBudget(budgetId: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("You must be signed in to delete a budget.");
  }

  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("id", budgetId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}