# PesaTrack – Personal Finance & Budgeting Platform

PesaTrack is a personal finance management application designed to help users track their income and expenses, monitor spending habits, and manage monthly budgets.

Built with React, TypeScript, Tailwind CSS, and Supabase, the application provides a responsive interface for managing financial transactions and understanding monthly spending patterns.

## Features

### Authentication
- User registration and sign-in.
- Secure session management using Supabase Authentication.
- User-specific financial data protected by Row Level Security (RLS).

### Dashboard
- Monthly income, expenses, and balance summaries.
- Transaction count for the selected month.
- Visual representation of income and expenses.

### Transaction Management
- Record income and expense transactions.
- Edit and delete existing transactions.
- Categorize transactions.
- Search and filter transactions by category, type, and date.
- Paginated transaction listing.

### Budget Management
- Create monthly budgets for expense categories.
- Edit and delete existing budgets.
- Track spending against allocated limits.
- Calculate remaining budget amounts.
- Visual spending progress indicators.
- Budget status indicators for approaching and exceeded limits.
- Switch between different budget months.

### User Interface
- Responsive application layout.
- Light and dark themes.
- Reusable React components.
- Interactive charts and visual feedback.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI development |
| TypeScript | Static typing |
| Vite | Development server and build tooling |
| Tailwind CSS | Styling and responsive layouts |
| Supabase | Backend services and PostgreSQL database |
| Supabase Auth | User authentication |
| React Router | Application navigation |
| Recharts | Financial data visualization |
| Git & GitHub | Version control |

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm
- Git
- A Supabase account

### 1. Clone the repository

```bash
git clone https://github.com/Weshy984/PesaTrack.git
```

### 2. Navigate to the project directory

```bash
cd PesaTrack
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Replace the placeholder values with the URL and publishable key from your Supabase project.

**Never commit your actual `.env` file or secret keys to GitHub.**

### 5. Configure Supabase

Create a Supabase project and configure:

- Authentication for email-based registration and sign-in.
- The `transactions` table.
- The `budgets` table.
- Row Level Security policies to restrict access to each authenticated user's records.
- Appropriate table permissions for authenticated users.

The application expects the database schema and policies used by its transaction and budget services.

### 6. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal to access PesaTrack.

### 7. Build for production

```bash
npm run build
```

## Project Structure

```text
src/
├── components/
│   ├── AuthForm.tsx
│   ├── BudgetCard.tsx
│   ├── BudgetForm.tsx
│   ├── MonthlyExpenseChart.tsx
│   ├── SummaryCard.tsx
│   ├── TransactionForm.tsx
│   ├── TransactionList.tsx
│   └── TransactionModal.tsx
│
├── pages/
│   ├── Budgets.tsx
│   ├── Dashboard.tsx
│   └── Transactions.tsx
│
├── lib/
│   └── supabase.ts
│
├── services/
│   └── budgetService.ts
│
├── types/
│   ├── budget.ts
│   └── transaction.ts
│
├── utils/
│   └── budgetCalculations.tsx
│
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## Screenshots

Add application screenshots here as the interface evolves.

| Dashboard | Transactions |
|---|---|
| Add dashboard screenshot | Add transactions screenshot |

| Budget Management | Dark Mode |
|---|---|
| Add budgets screenshot | Add dark mode screenshot |

## Security

PesaTrack uses Supabase Row Level Security to ensure authenticated users can access and manage only their own financial records.

Environment-specific credentials are stored in local environment variables and excluded from version control.

## Future Improvements

Potential enhancements include:

- Automated budget notifications.
- Recurring transactions.
- CSV transaction imports.
- Automatic transaction categorization.
- Spending trends and financial insights.
- Rule-based financial recommendations.

## Contributing

Contributions, suggestions, and feedback are welcome.

## License

This project is currently available for educational and portfolio purposes. A formal open-source license can be added separately.

---

**PesaTrack** – Your personal finance companion.