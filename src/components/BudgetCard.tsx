import type { BudgetSummary } from "../utils/budgetCalculations";
import BudgetAlerts from "./BudgetAlerts";

type BudgetCardProps = {
  summary: BudgetSummary;
  onEdit: () => void;
  onDelete: () => void;
};

function BudgetCard({ summary, onEdit, onDelete }: BudgetCardProps) {
  const { budget, spent, remaining, percentageUsed } = summary;

  const isOverspent = percentageUsed > 100;
  const isNearLimit = percentageUsed >= 80 && !isOverspent;

  const progressColor = isOverspent
    ? "bg-red-500"
    : isNearLimit
      ? "bg-amber-500"
      : "bg-teal-600";

  const statusLabel = isOverspent
    ? "Over budget"
    : isNearLimit
      ? "Approaching limit"
      : "Within budget";

  const displayedPercentage = Math.min(percentageUsed, 100);

  const formatCurrency = (value: number) =>
    `KSh ${Math.abs(value).toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <article className="surface rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#102a2a] dark:text-white">
            {budget.category}
          </h3>

          <p className="mt-1 text-sm text-[#6a7c7b] dark:text-slate-300">
            Monthly spending limit
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isOverspent
              ? "bg-red-100 text-red-700"
              : isNearLimit
                ? "bg-amber-100 text-amber-700"
                : "bg-teal-100 text-teal-700"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <p className="mt-5 text-2xl font-extrabold text-[#102a2a] dark:text-white">
        {formatCurrency(budget.amount)}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm">
        <span className="text-[#6a7c7b] dark:text-slate-300">
          Spent: {formatCurrency(spent)}
        </span>

        <span className="font-semibold text-[#102a2a] dark:text-white">
          {percentageUsed.toFixed(1)}%
        </span>
      </div>

      <div
        className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
        role="progressbar"
        aria-label={`${budget.category} budget usage`}
        aria-valuenow={Math.min(percentageUsed, 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${displayedPercentage}%` }}
        />
      </div>

      <BudgetAlerts summary={summary} />

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
        <span className="text-sm text-[#6a7c7b] dark:text-slate-300">
          {isOverspent ? "Amount exceeded" : "Remaining"}
        </span>

        <span
          className={`font-bold ${
            isOverspent
              ? "text-red-600"
              : "text-[#13795b] dark:text-emerald-400"
          }`}
        >
          {formatCurrency(remaining)}
        </span>
      </div>
        <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
         <button
           type="button"
           onClick={onEdit}
           className="rounded-lg border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-slate-800"
          >
             Edit budget
         </button>

         <button
           type="button"
           onClick={onDelete}
           className="rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-slate-800"
        >
          Delete
          </button>
      </div>
    </article>
  );
}

export default BudgetCard;