import { useEffect, useState } from "react";
import type { Transaction, TransactionType } from "../types/transaction";
import { supabase } from "../lib/supabase";

type TransactionFormProps = {
  onTransactionAdded: () => void;
  editingTransaction: Transaction | null;
  onCancelEdit: () => void;
};

function TransactionForm({
  onTransactionAdded,
  editingTransaction,
  onCancelEdit,
}: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState("Food");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(String(editingTransaction.amount));
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setTransactionDate(editingTransaction.transaction_date);
    }
  }, [editingTransaction]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage("Please enter a valid amount greater than zero.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("You must be signed in to save a transaction.");
      setLoading(false);
      return;
    }

    let saveError: string | null = null;

    if (editingTransaction) {
      // Update an existing transaction
      const { error } = await supabase
        .from("transactions")
        .update({
          title: title.trim(),
          amount: numericAmount,
          type,
          category,
          transaction_date: transactionDate,
        })
        .eq("id", editingTransaction.id)
        .eq("user_id", user.id);

      saveError = error?.message ?? null;
    } else {
      // Insert a new transaction
      const { error } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          title: title.trim(),
          amount: numericAmount,
          type,
          category,
          transaction_date: transactionDate,
        });

      saveError = error?.message ?? null;
    }

    setLoading(false);

    if (saveError) {
      setMessage(`Failed to save transaction: ${saveError}`);
      return;
    }

    setMessage(
      editingTransaction
        ? "Transaction updated successfully!"
        : "Transaction saved successfully!"
    );

    onTransactionAdded();

    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setTransactionDate(new Date().toISOString().slice(0, 10));
    //setMessage("");

    if (editingTransaction) {
      onCancelEdit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Description
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Groceries"
          required
          className="w-full rounded-lg border border-[#e4ece9] bg-[#f7faf8] px-4 py-3 text-[#102a2a] outline-none transition focus:border-[#13795b] focus:ring-2 focus:ring-[#d9f1e5]"
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Amount (KSh)
          </label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="e.g. 500"
            required
            className="w-full rounded-lg border border-[#e4ece9] bg-[#f7faf8] px-4 py-3 text-[#102a2a] outline-none transition focus:border-[#13795b] focus:ring-2 focus:ring-[#d9f1e5]"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Transaction type
          </label>
          <select
            id="type"
            value={type}
            onChange={(event) =>
              setType(event.target.value as TransactionType)
            }
            className="w-full rounded-lg border border-[#e4ece9] bg-[#f7faf8] px-4 py-3 text-[#102a2a] outline-none transition focus:border-[#13795b] focus:ring-2 focus:ring-[#d9f1e5]"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-[#e4ece9] bg-[#f7faf8] px-4 py-3 text-[#102a2a] outline-none transition focus:border-[#13795b] focus:ring-2 focus:ring-[#d9f1e5]"
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Housing">Housing</option>
            <option value="Salary">Salary</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="transactionDate"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Transaction date
          </label>
          <input
            id="transactionDate"
            type="date"
            value={transactionDate}
            onChange={(event) => setTransactionDate(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="primary-button w-full py-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? editingTransaction
              ? "Updating..."
              : "Saving..."
            : editingTransaction
              ? "Update transaction"
              : "Save transaction"}
        </button>

        {editingTransaction && (
          <button
            type="button"
            onClick={() => {
              onCancelEdit();
              setTitle("");
              setAmount("");
              setType("expense");
              setCategory("Food");
              setTransactionDate(new Date().toISOString().slice(0, 10));
              setMessage("");
            }}
            className="secondary-button w-full py-3"
          >
            Cancel editing
          </button>
        )}
      </div>

      {message && (
        <p
          className={`rounded-lg p-3 text-sm ${
            message.toLowerCase().includes("successfully")
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default TransactionForm;
