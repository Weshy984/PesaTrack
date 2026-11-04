import type { Budget } from "../types/budget";
import type { Transaction } from "../types/transaction";

export type BudgetSummary = {
  budget: Budget;
  spent: number;
  remaining: number;
  percentageUsed: number;
};

export function calculateBudgetSummaries(
  budgets: Budget[],
  transactions: Transaction[]
): BudgetSummary[] {
  return budgets.map((budget) => {
    const spent = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.category.trim().toLowerCase() ===
            budget.category.trim().toLowerCase() &&
          transaction.transaction_date.startsWith(
            budget.budget_month.slice(0, 7)
          )
      )
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );

    const remaining = budget.amount - spent;

    const percentageUsed =
      budget.amount > 0
        ? (spent / budget.amount) * 100
        : 0;

    return {
      budget,
      spent,
      remaining,
      percentageUsed,
    };
  });
}