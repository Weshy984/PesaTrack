import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { supabase } from "./lib/supabase";
import AuthForm from "./components/AuthForm";

import Dashboard from "./pages/Dashboard";

import Transactions from "./pages/Transactions";

import type { Transaction } from "./types/transaction";
import TransactionModal from "./components/TransactionModal";
import "./App.css";
import type { Budget } from "./types/budget";
import { getBudgets } from "./services/budgetService";
import Budgets from "./pages/Budgets";

type MobileIconName = "home" | "activity" | "budget" | "profile" | "plus";

function MobileIcon({ name }: { name: MobileIconName }) {
  const paths = {
    home: "M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10.5ZM9 22v-6h6v6",
    activity: "M4 19V5m0 14h16M8 16l3-4 3 2 5-7",
    budget: "M4 7h16v13H4zM7 4h10v3H7zM8 11h8M8 15h5",
    profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0",
    plus: "M12 5v14M5 12h14",
  } as const;

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFirstName, setUserFirstName] = useState("there");
  const [checkingSession, setCheckingSession] = useState(true);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState("");

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [isTransactionModalOpen, setIsTransactionModalOpen] =
    useState(false);

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetsLoading, setBudgetsLoading] = useState(true);
  const [budgetsError, setBudgetsError] = useState("");

  const [selectedBudgetMonth, setSelectedBudgetMonth] = useState(() => {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
  ].join("-");
  });

  const navigate = useNavigate();


  const getFirstName = (user: {
    user_metadata?: Record<string, unknown>;
  } | null) => {
    const metadata = user?.user_metadata;
    const firstName = metadata?.first_name ?? metadata?.firstName;
    const fullName = metadata?.full_name ?? metadata?.name;
    const name = typeof firstName === "string" && firstName.trim()
      ? firstName
      : typeof fullName === "string" && fullName.trim()
        ? fullName.split(/\s+/)[0]
        : "";

    return name.trim() || "there";
  };

  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    setTransactionsError("");

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setTransactionsError(error.message);
    } else {
      setTransactions((data ?? []) as Transaction[]);
    }

    setTransactionsLoading(false);
  };

  const fetchBudgets = async (month: string) => {
  setBudgetsLoading(true);
  setBudgetsError("");

  try {
    const data = await getBudgets(`${month}-01`);
    setBudgets(data);
  } catch (error) {
    setBudgetsError(
      error instanceof Error
        ? error.message
        : "Failed to load budgets."
    );
  } finally {
    setBudgetsLoading(false);
  }
};

  const expenseCategories = Array.from(
  new Set(
    transactions
      .filter((transaction) => transaction.type === "expense")
      .map((transaction) => transaction.category.trim())
      .filter((category) => category.length > 0)
  )
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        console.error("Session initialization failed:", error.message);
      }

      setIsAuthenticated(Boolean(session));
      setUserFirstName(getFirstName(session?.user ?? null));
      setCheckingSession(false);

      if (session) {
        await Promise.all([
          fetchTransactions(), 
          fetchBudgets(selectedBudgetMonth)
        ]);
      } else {
        setBudgets([]);
        setBudgetsLoading(false);
        setTransactions([]);
        setTransactionsLoading(false);
      }
    };

    void initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      setIsAuthenticated(Boolean(session));
      setUserFirstName(getFirstName(session?.user ?? null));

      if (event === "SIGNED_IN" && session) {
        void fetchTransactions();
        void fetchBudgets(selectedBudgetMonth);
      }

      if (event === "SIGNED_OUT") {
        setBudgets([]);
        setBudgetsError("");
        setBudgetsLoading(false);
        setTransactions([]);
        setTransactionsError("");
        setTransactionsLoading(false);
        setEditingTransaction(null);
        setUserFirstName("there");
        navigate("/login", { replace: true });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyTransactions = transactions.filter((transaction) =>
    transaction.transaction_date.startsWith(currentMonth)
  );

  const monthlyTransactionCount = monthlyTransactions.length;

  const monthlyIncome = monthlyTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const monthlyExpenses = monthlyTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const monthlyBalance = monthlyIncome - monthlyExpenses;

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleTransactionSaved = () => {
    void fetchTransactions();
    setEditingTransaction(null);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(false);

  };

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <p className="text-slate-600">Checking your session...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <AuthForm />
      </main>
    );
  }

  
return (
<main className="app-shell">
  <aside className="app-sidebar">
    <Link to="/dashboard" className="brand-mark"><span>₱</span><span className="brand-name">PesaTrack</span></Link>
    <div className="brand-description">
      <p>A clearer view of where your money goes.</p>
    </div>
    <p className="sidebar-caption">Workspace</p>
    <nav>
      <Link
        to="/dashboard"
        className="nav-link"
      >
        <span>▦</span> Dashboard
      </Link>
      <Link
        to="/transactions"
        className="nav-link"
      >
        <span>↗</span> Transactions
      </Link>
      <Link 
        to="/budgets" 
        className="nav-link"
      >
        <span>▤</span> Budgets
      </Link>
    </nav>
    <div className="sidebar-footer">
      <button 
      type="button" 
      onClick={async () => { 
        const { error } = 
        await supabase.auth.signOut(); 
        if (error) 
          console.error("Sign-out failed:", error.message); 
      }} 
      className="nav-link" 
      style={{ width: "100%", border: 0, background: "transparent" }}>
        ↪ 
        <span>Sign out</span></button>
    </div>
  </aside>
  <div className="content-shell">
  <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="/dashboard"
        element={
          <div className="page-content">
            <Dashboard
              userFirstName={userFirstName}
              monthlyIncome={monthlyIncome}
              monthlyExpenses={monthlyExpenses}
              monthlyBalance={monthlyBalance}
              monthlyTransactionCount={monthlyTransactionCount}
              onAddTransaction={() => {
                setEditingTransaction(null);
                setIsTransactionModalOpen(true);
              }}
            />

          </div>
        }
      />

      <Route
        path="/transactions"
        element={
          <div className="page-content"><Transactions
            transactions={transactions}
            loading={transactionsLoading}
            errorMessage={transactionsError}
            onTransactionDeleted={fetchTransactions}
            onEditTransaction={handleEditTransaction}
          /></div>
        }
      />

      <Route
        path="/budgets"
        element={
         <Budgets
           budgets={budgets}
           transactions={transactions}
           loading={budgetsLoading}
           errorMessage={budgetsError}
           categories={expenseCategories}
           selectedBudgetMonth={selectedBudgetMonth}
           onBudgetMonthChange={(month) => {
            setSelectedBudgetMonth(month);
            void fetchBudgets(month);
          }}
          onBudgetCreated={() => {
            void fetchBudgets(selectedBudgetMonth);
          }}
          />
        }
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>

    <TransactionModal
      isOpen={isTransactionModalOpen}
      onClose={handleCancelEdit}
      onTransactionAdded={handleTransactionSaved}
      editingTransaction={editingTransaction}
    />
    </div>
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <NavLink to="/dashboard" className="mobile-nav-item">
        <span className="mobile-nav-icon"><MobileIcon name="home" /></span>
        <span>Home</span>
      </NavLink>
      <NavLink to="/transactions" className="mobile-nav-item">
        <span className="mobile-nav-icon"><MobileIcon name="activity" /></span>
        <span>Transactions</span>
      </NavLink>
      <button
        type="button"
        className="mobile-add-button"
        aria-label="Add transaction"
        onClick={() => {
          setEditingTransaction(null);
          setIsTransactionModalOpen(true);
        }}
      >
        <MobileIcon name="plus" />
      </button>
      <NavLink to="/budgets" className="mobile-nav-item">
        <span className="mobile-nav-icon"><MobileIcon name="budget" /></span>
        <span>Budgets</span>
      </NavLink>
      <button
        type="button"
        className="mobile-nav-item mobile-nav-button"
        onClick={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) console.error("Sign-out failed:", error.message);
        }}
      >
        <span className="mobile-nav-icon"><MobileIcon name="profile" /></span>
        <span>Profile</span>
      </button>
    </nav>
  </main>
);

}

export default App;
