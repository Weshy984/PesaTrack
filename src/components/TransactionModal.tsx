
import TransactionForm from "./TransactionForm";
import type { Transaction } from "../types/transaction";
import { useEffect } from "react";

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
  editingTransaction: Transaction | null;
};

function TransactionModal({
  isOpen,
  onClose,
  onTransactionAdded,
  editingTransaction,
}: TransactionModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a2a]/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="surface relative max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 id="transaction-modal-title" className="text-2xl font-extrabold tracking-tight text-[#102a2a]">
              {editingTransaction
                ? "Edit Transaction"
                : "Add New Transaction"}
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              {editingTransaction
                ? "Update your transaction details."
                : "Record your income or expenses."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close transaction form"
            className="icon-button"
          >
            ✕
          </button>
        </div>

        <TransactionForm
          onTransactionAdded={onTransactionAdded}
          editingTransaction={editingTransaction}
          onCancelEdit={onClose}
        />
      </div>
    </div>
  );
}

export default TransactionModal;
