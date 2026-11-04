import TransactionList from "../components/TransactionList";
import type { Transaction } from "../types/transaction";

type TransactionsProps = {
  transactions: Transaction[];
  loading: boolean;
  errorMessage: string;
  onTransactionDeleted: () => void;
  onEditTransaction: (transaction: Transaction) => void;
};

function Transactions({
  transactions,
  loading,
  errorMessage,
  onTransactionDeleted,
  onEditTransaction,
}: TransactionsProps) {
  return (
    <section>
      <TransactionList
        transactions={transactions}
        loading={loading}
        errorMessage={errorMessage}
        onTransactionDeleted={onTransactionDeleted}
        onEditTransaction={onEditTransaction}
      />
    </section>
  );
}

export default Transactions;