import { useEffect, useState } from "react";
import type { Transaction } from "../types/transaction";
import { supabase } from "../lib/supabase";

type TransactionListProps = {
  transactions: Transaction[];
  loading: boolean;
  errorMessage: string;
  onTransactionDeleted: () => void;
  onEditTransaction: (transaction: Transaction) => void;
};

function TransactionList({
  transactions,
  loading,
  errorMessage,
  onTransactionDeleted,
  onEditTransaction,
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "income" | "expense"
  >("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const categories = Array.from(
    new Set(transactions.map((transaction) => transaction.category))
  ).sort();
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (typeFilter === "all" || transaction.type === typeFilter) &&
      (categoryFilter === "all" || transaction.category === categoryFilter) &&
      (!startDate || transaction.transaction_date >= startDate) &&
      (!endDate || transaction.transaction_date <= endDate)
  );

  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const startIndex = (currentPage - 1) * transactionsPerPage;

  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + transactionsPerPage
  );

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setStartDate("");
    setEndDate("");
  };

  const activeFilters: string[] = [];
  if (searchTerm.trim()) {
    activeFilters.push(`Search: ${searchTerm}`);
  }
  if (typeFilter !== "all") {
    activeFilters.push(
      `Type: ${typeFilter === "income" ? "Income" : "Expense"}`
    );
  }
  if (categoryFilter !== "all") {
    activeFilters.push(`Category: ${categoryFilter}`);
  }
  if (startDate) {
    activeFilters.push(`From: ${startDate}`);
  }
  if (endDate) {
    activeFilters.push(`To: ${endDate}`);
  }

  const handleDelete = async (transactionId: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId);
    if (error) {
      alert(`Failed to delete transaction: ${error.message}`);
      return;
    }
    onTransactionDeleted();
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, categoryFilter, startDate, endDate]);

  return (
    <section className="surface p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Ledger</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#102a2a]">
            All transactions
          </h2>
        </div>
        <p className="text-sm font-medium text-[#6a7c7b]">
          Showing {filteredTransactions.length} of {transactions.length}
        </p>
      </div>

      <div className="transaction-filters mt-6">
        <div className="relative">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by description..."
            aria-label="Search transactions by description"
            className="transaction-search w-full"
          />
        </div>
        <div className="transaction-filter-grid">
          <label className="filter-field">
            <span className="filter-label">Transaction type</span>
            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target.value as "all" | "income" | "expense"
                )
              }
              className="filter-control"
            >
              <option value="all">All transactions</option>
              <option value="income">Income only</option>
              <option value="expense">Expenses only</option>
            </select>
          </label>
          <label className="filter-field">
            <span className="filter-label">Category</span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="filter-control"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-field">
            <span className="filter-label">From date</span>
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => setStartDate(event.target.value)}
              className="filter-control"
            />
          </label>
          <label className="filter-field">
            <span className="filter-label">To date</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              className="filter-control"
            />
          </label>
        </div>
        {activeFilters.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Active filters:
            </span>

            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="rounded-full border border-[#cfe9dc] bg-[#edf8f1] px-3 py-1 text-xs font-semibold text-[#13795b]"
              >
                {filter}
              </span>
            ))}
          </div>
        )}
        <div className="filter-actions">
          <span className="filter-summary">
            {filteredTransactions.length} matching{" "}
            {filteredTransactions.length === 1 ? "transaction" : "transactions"}
          </span>
          <button
            type="button"
            onClick={clearFilters}
            className="secondary-button filter-clear"
          >
            Clear filters
          </button>
        </div>
      </div>

      {loading && (
        <p className="mt-5 text-sm text-[#6a7c7b]">
          Loading transactions...
        </p>
      )}
      {errorMessage && (
        <p className="mt-5 text-sm text-[#c45b52]">{errorMessage}</p>
      )}
      {!loading && !errorMessage && transactions.length === 0 && (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-[#cfe0d7] bg-[#f7faf8] px-6 py-12 text-center dark:border-slate-600 dark:bg-slate-800">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e5f4eb] text-2xl dark:bg-slate-700">
            💰
          </div>

          <h3 className="text-lg font-bold text-[#102a2a] dark:text-white">
            No transactions yet
          </h3>

          <p className="mt-2 max-w-sm text-sm text-[#6a7c7b] dark:text-slate-300">
            Your financial activity will appear here once you record your first
            transaction.
          </p>
        </div>
      )}
      {!loading && !errorMessage && filteredTransactions.length > 0 && (
        <div className="transaction-list mt-5">
          {paginatedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="transaction-row flex flex-col gap-4 rounded-xl border border-[#e4ece9] bg-white p-4 transition-all duration-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#102a2a]">{transaction.title}</p>
                <p className="mt-1 text-sm text-[#6a7c7b]">
                  {transaction.category} · {transaction.transaction_date}
                </p>
              </div>
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                  transaction.type === "income"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {transaction.type === "income" ? "Income" : "Expense"}
              </span>
              <p
                className={`font-bold ${
                  transaction.type === "income"
                    ? "text-[#13795b]"
                    : "text-[#c45b52]"
                }`}
              >
                {transaction.type === "income" ? "+" : "−"} KSh{" "}
                {Number(transaction.amount).toLocaleString("en-KE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className="transaction-actions">
                <button
                  type="button"
                  onClick={() => onEditTransaction(transaction)}
                  aria-label={`Edit ${transaction.title}`}
                  title={`Edit ${transaction.title}`}
                  className="icon-action icon-action-edit"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3Zm9.5-12.5 3 3" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(transaction.id)}
                  aria-label={`Delete ${transaction.title}`}
                  title={`Delete ${transaction.title}`}
                  className="icon-action icon-action-delete"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 7h16M10 11v6m4-6v6M9 7V4h6v3m-9 0 1 13h8l1-13" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !errorMessage && totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#edf2ef] pt-5">
          <p className="text-sm text-[#6a7c7b]">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              disabled={currentPage === 1}
              className="secondary-button disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="secondary-button disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {!loading &&
  !errorMessage &&
  transactions.length > 0 &&
  filteredTransactions.length === 0 && (
    <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-[#cfe0d7] bg-[#f7faf8] px-6 py-12 text-center dark:border-slate-600 dark:bg-slate-800">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e5f4eb] text-2xl dark:bg-slate-700">
        🔎
      </div>

      <h3 className="text-lg font-bold text-[#102a2a] dark:text-white">
        No matching transactions
      </h3>

      <p className="mt-2 max-w-sm text-sm text-[#6a7c7b] dark:text-slate-300">
        We couldn't find any transactions matching your current search or filters.
        Try adjusting your filters or clearing them.
      </p>

      <button
        type="button"
        onClick={clearFilters}
        className="secondary-button mt-5"
      >
        Clear all filters
      </button>
    </div>
  )}
    </section>
  );
}

export default TransactionList;
