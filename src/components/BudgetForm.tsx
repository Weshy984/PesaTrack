import { useEffect, useState } from "react";
import { createBudget, updateBudget } from "../services/budgetService";
import type { Budget } from "../types/budget";

type BudgetFormProps = {
  categories: string[];
  selectedBudgetMonth: string;
  onBudgetCreated: () => void;
  editingBudget: Budget | null;
  onCancelEdit: () => void;
};

function BudgetForm({
  categories,
  selectedBudgetMonth,
  onBudgetCreated,
  editingBudget,
  onCancelEdit,
}: BudgetFormProps) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editingBudget) {
      setCategory(editingBudget.category);
      setAmount(String(editingBudget.amount));
      setMessage("");
      setErrorMessage("");
    } else {
      setCategory("");
      setAmount("");
    }
  }, [editingBudget]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    const numericAmount = Number(amount);

    if (!category) {
      setErrorMessage("Please select a category.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setErrorMessage("Enter a valid budget amount.");
      return;
    }

    setSaving(true);

    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, {
          category,
          amount: numericAmount,
          budgetMonth: `${selectedBudgetMonth}-01`,
        });

        setMessage("Budget updated successfully!");
      } else {
        await createBudget({
          category,
          amount: numericAmount,
          budgetMonth: `${selectedBudgetMonth}-01`,
        });

        setMessage("Budget created successfully!");
      }

      setAmount("");
      setCategory("");
      onBudgetCreated();

      if (editingBudget) {
        onCancelEdit();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create budget."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface rounded-2xl p-6">
      <h2 className="text-lg font-bold text-[#102a2a] dark:text-white">
        {editingBudget ? "Edit budget" : "Create a budget"}
      </h2>

      <p className="mt-1 text-sm text-[#6a7c7b] dark:text-slate-300">
        Set a spending limit for a category.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Category</span>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
            className="filter-control"
          >
            <option value="">Select a category</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Monthly limit (KSh)</span>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="e.g. 15000"
            required
            className="filter-control"
          />
        </label>

      </div>

      {message && (
        <p className="mt-4 text-sm text-emerald-600">
          {message}
        </p>
      )}

      {errorMessage && (
        <p className="mt-4 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={saving || categories.length === 0}
        className="mt-6 rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving
         ? "Saving..."
         : editingBudget
           ? "Update budget"
           : "Create budget"}
      </button>

      {editingBudget && (
        <button
          type="button"
          onClick={onCancelEdit}
          className="ml-3 rounded-lg border border-slate-300 px-6 py-3 font-semibold dark:border-slate-600"
        >
           Cancel
        </button>
     )}

      {categories.length === 0 && (
        <p className="mt-3 text-sm text-amber-600">
          Record an expense transaction first to make categories available.
        </p>
      )}
    </form>
  );
}

export default BudgetForm;