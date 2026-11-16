import SummaryCard from "../components/SummaryCard";
import MonthlyExpenseChart from "../components/MonthlyExpenseChart";

type DashboardProps = {
  userFirstName: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  monthlyTransactionCount: number;
  onSignOut: () => void;
  onAddTransaction: () => void;
};

function Dashboard({
  userFirstName,
  monthlyIncome,
  monthlyExpenses,
  monthlyBalance,
  monthlyTransactionCount,
  onSignOut,
  onAddTransaction,
}: DashboardProps) {
  return (
    <>
      <div className="dashboard-heading mb-8">
        <div>
          <p className="eyebrow">Overview</p>
          <div className="dashboard-title-row">
            <button
              type="button"
              className="dashboard-profile-button"
              aria-label="Sign out"
              title="Sign out"
              onClick={onSignOut}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />
              </svg>
            </button>
            <h1 className="page-title">Good morning, {userFirstName}.</h1>
          </div>
          <p className="page-subtitle">Here is your financial pulse for this month.</p>
        </div>
        <button type="button" onClick={onAddTransaction} className="primary-button desktop-add-button">
          ＋ Add transaction
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Monthly Income"
          amount={`KSh ${monthlyIncome.toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          amountColor="positive"
        />

        <SummaryCard
          title="Monthly Expenses"
          amount={`KSh ${monthlyExpenses.toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          amountColor="negative"
        />

        <SummaryCard
          title="Monthly Balance"
          amount={`KSh ${monthlyBalance.toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          amountColor={
            monthlyBalance > 0
              ? "positive"
              : monthlyBalance < 0
              ? "negative"
              : "neutral"
          }
        />

        <SummaryCard
          title="Monthly Transactions"
          amount={monthlyTransactionCount.toString()}
        />
      </div>

      <MonthlyExpenseChart
        income={monthlyIncome}
        expenses={monthlyExpenses}
      />
    </>
  );
}

export default Dashboard;