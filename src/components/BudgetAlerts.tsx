import type { BudgetSummary } from "../utils/budgetCalculations";

type BudgetAlertsProps = {
  summary: BudgetSummary;
};

function BudgetAlerts({ summary }: BudgetAlertsProps) {
  if (summary.percentageUsed < 80) {
    return null;
  }

  const isOverBudget = summary.percentageUsed > 100;

  return (
    <div
      className={`mt-5 rounded-xl border p-4 ${
        isOverBudget
          ? "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          : "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
      }`}
      role="status"
    >
      <h3 className="font-semibold">
        {isOverBudget ? "Budget exceeded" : "Approaching budget limit"}
      </h3>

      <p className="mt-1 text-sm">
        {summary.percentageUsed.toFixed(1)}% of this budget has been used.
      </p>

      <p className="mt-1 text-sm">
        Spent: KSh {summary.spent.toLocaleString("en-KE")} of KSh{" "}
        {summary.budget.amount.toLocaleString("en-KE")}
      </p>
    </div>
  );
}

export default BudgetAlerts;