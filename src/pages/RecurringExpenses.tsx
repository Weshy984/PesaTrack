import RecurringExpenseForm from "../components/RecurringExpenseForm";
import type { RecurringExpense } from "../types/recurringExpense";

type RecurringExpensesProps = {
  recurringExpenses: RecurringExpense[];
  loading: boolean;
  errorMessage: string;
  categories: string[];
  onExpenseCreated: () => void;
  onToggleStatus: (expense: RecurringExpense) => void;
  onDelete: (expenseId: string) => void;
};

function RecurringExpenses({
  recurringExpenses,
  loading,
  errorMessage,
  categories,
  onExpenseCreated,
  onToggleStatus,
  onDelete,
}: RecurringExpensesProps) {
  return (
    <section className="page-content">
      <div className="mb-8">
        <p className="eyebrow">Expense automation</p>

        <h1 className="mt-1 text-2xl font-extrabold text-[#102a2a] dark:text-white">
          Recurring Expenses
        </h1>

        <p className="mt-2 text-sm text-[#6a7c7b] dark:text-slate-300">
          Manage expenses that repeat every month.
        </p>
      </div>

      <RecurringExpenseForm
        categories={categories}
        onExpenseCreated={onExpenseCreated}
      />

      <div className="mt-8">
        <h2 className="mb-5 text-xl font-bold text-[#102a2a] dark:text-white">
          Your recurring expenses
        </h2>

        {loading && <p>Loading recurring expenses...</p>}

        {errorMessage && (
          <p className="text-red-600">{errorMessage}</p>
        )}

        {!loading && !errorMessage && recurringExpenses.length === 0 && (
          <div className="surface rounded-2xl p-8 text-center">
            <h3 className="text-lg font-bold text-[#102a2a] dark:text-white">
              No recurring expenses yet
            </h3>

            <p className="mt-2 text-sm text-[#6a7c7b] dark:text-slate-300">
              Create your first recurring expense to get started.
            </p>
          </div>
        )}

        {!loading && !errorMessage && recurringExpenses.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {recurringExpenses.map((expense) => (
              <div
                key={expense.id}
                className="surface rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#102a2a] dark:text-white">
                      {expense.title}
                    </h3>

                    <p className="mt-1 text-sm text-[#6a7c7b] dark:text-slate-300">
                      {expense.category}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      expense.is_active
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {expense.is_active ? "Active" : "Paused"}
                  </span>
                </div>

                <p className="mt-4 text-2xl font-extrabold text-[#102a2a] dark:text-white">
                  KSh {expense.amount.toLocaleString("en-KE")}
                </p>

                <p className="mt-2 text-sm text-[#6a7c7b] dark:text-slate-300">
                  Next due: {expense.next_due_date}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(expense)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium dark:border-slate-600"
                  >
                    {expense.is_active ? "Pause" : "Resume"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(expense.id)}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 dark:border-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RecurringExpenses;