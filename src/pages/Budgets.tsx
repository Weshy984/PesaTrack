import { useState } from "react";
import type { Budget } from "../types/budget";
import BudgetForm from "../components/BudgetForm";
import type { Transaction } from "../types/transaction";
import { calculateBudgetSummaries } from "../utils/budgetCalculations";
import BudgetCard from "../components/BudgetCard";
import { deleteBudget } from "../services/budgetService";

type BudgetsProps = {
  budgets: Budget[];
  loading: boolean;
  errorMessage: string;
  onBudgetCreated: () => void;
  categories: string[];
  selectedBudgetMonth: string;
  onBudgetMonthChange: (month: string) => void;
  transactions: Transaction[];
};

function Budgets({
  budgets,
  loading,
  errorMessage,
  onBudgetCreated,
  categories,
  selectedBudgetMonth,
  onBudgetMonthChange,
  transactions,
}: BudgetsProps) {
  const budgetSummaries = calculateBudgetSummaries(budgets, transactions);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const handleDeleteBudget = async (budgetId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget? This action cannot be undone."
    );
    
    if (!confirmed) return;
    try {
     await deleteBudget(budgetId);
     onBudgetCreated();

    if (editingBudget?.id === budgetId) {
      setEditingBudget(null);
    }
    } catch (error) {
      console.error("Failed to delete budget:", error);

    window.alert(
      error instanceof Error
        ? error.message
        : "Failed to delete budget."
    );
  }
  };

  return (
    <section className="page-content">
      <div className="mb-8">
        <p className="eyebrow">Financial planning</p>

        <h1 className="mt-1 text-2xl font-extrabold text-[#102a2a] dark:text-white">
          Budgets
        </h1>

        <p className="mt-2 text-sm text-[#6a7c7b] dark:text-slate-300">
          Set monthly spending limits and keep track of your expenses.
        </p>
      </div>

      <div className="surface mb-6 rounded-2xl p-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#102a2a] dark:text-white">
            Select budget month
          </span>

          <input
            type="month"
            value={selectedBudgetMonth}
            onChange={(event) => onBudgetMonthChange(event.target.value)}
            className="filter-control max-w-xs"
          />
        </label>
      </div>

      <BudgetForm
        categories={categories}
        onBudgetCreated={onBudgetCreated}
        selectedBudgetMonth={selectedBudgetMonth}
        editingBudget={editingBudget}
        onCancelEdit={() => setEditingBudget(null)}
      />

      <div className="mt-8">
        {loading && <p>Loading budgets...</p>}

        {errorMessage && (
          <p className="text-red-600">{errorMessage}</p>
        )}

        {!loading && !errorMessage && budgets.length === 0 && (
          <div className="surface rounded-2xl p-8 text-center">
            <h2 className="text-lg font-bold text-[#102a2a] dark:text-white">
              No budgets yet
            </h2>

            <p className="mt-2 text-sm text-[#6a7c7b] dark:text-slate-300">
              Create your first monthly budget to start tracking your spending.
            </p>
          </div>
        )}

        {!loading && !errorMessage && budgetSummaries.length > 0 && (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#102a2a] dark:text-white">
                Your budgets
              </h2>

              <p className="mt-1 text-sm text-[#6a7c7b] dark:text-slate-300">
                Tracking {budgetSummaries.length}{" "}
                {budgetSummaries.length === 1 ? "budget" : "budgets"} for this
                month.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {budgetSummaries.map((summary) => (
                <BudgetCard 
                  key={summary.budget.id} 
                  summary={summary} 
                  onEdit={() => setEditingBudget(summary.budget)}
                  onDelete={() => handleDeleteBudget(summary.budget.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Budgets;