import { useState } from "react";
import { createRecurringExpense } from "../services/recurringExpenseService";

type RecurringExpenseFormProps = {
  categories: string[];
  onExpenseCreated: () => void;
};

function RecurringExpenseForm({
  categories,
  onExpenseCreated,
}: RecurringExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    const numericAmount = Number(amount);

    if (!title.trim()) {
      setErrorMessage("Please enter an expense title.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setErrorMessage("Enter a valid amount.");
      return;
    }

    if (!category) {
      setErrorMessage("Please select a category.");
      return;
    }

    if (endDate && endDate < startDate) {
      setErrorMessage("The end date cannot be before the start date.");
      return;
    }

    setSaving(true);

    try {
      await createRecurringExpense({
        title: title.trim(),
        amount: numericAmount,
        category,
        startDate,
        endDate: endDate || null,
      });

      setMessage("Recurring expense created successfully!");
      setTitle("");
      setAmount("");
      setCategory("");
      setEndDate("");

      onExpenseCreated();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to create recurring expense."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">
        Create recurring expense
      </h2>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Expense title
        </label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Monthly rent"
          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Amount (KSh)
        </label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="e.g. 15000"
          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Category
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          required
        >
          <option value="">Select category</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          First due date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          End date (optional)
        </label>
        <input
          type="date"
          min={startDate}
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {message && (
        <p className="text-sm text-emerald-600">{message}</p>
      )}

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={saving || categories.length === 0}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Create recurring expense"}
      </button>

      {categories.length === 0 && (
        <p className="text-sm text-amber-600">
          Record an expense first to make its category available.
        </p>
      )}
    </form>
  );
}

export default RecurringExpenseForm;