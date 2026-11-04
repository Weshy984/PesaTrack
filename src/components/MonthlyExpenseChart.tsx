
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type MonthlyExpenseChartProps = {
  income: number;
  expenses: number;
};

function MonthlyExpenseChart({
  income,
  expenses,
}: MonthlyExpenseChartProps) {
  const chartData = [
    { name: "Income", value: income },
    { name: "Expenses", value: expenses },
  ];

  const COLORS = ["#059669", "#dc2626"];

  const isDarkMode =
    document.documentElement.classList.contains("dark");

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm transition-colors dark:bg-slate-800">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Income vs Outcome
      </h2>

      {income === 0 && expenses === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">
          No financial activity recorded this month.
        </p>
      ) : (
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) =>
                  `KSh ${Number(value).toLocaleString("en-KE", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  border: `1px solid ${
                    isDarkMode ? "#475569" : "#e2e8f0"
                  }`,
                  borderRadius: "8px",
                  color: isDarkMode ? "#ffffff" : "#0f172a",
                }}
                itemStyle={{
                  color: isDarkMode ? "#ffffff" : "#0f172a",
                }}
                labelStyle={{
                  color: isDarkMode ? "#ffffff" : "#0f172a",
                }}
              />

              <Legend
                wrapperStyle={{
                  color: isDarkMode ? "#ffffff" : "#0f172a",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default MonthlyExpenseChart;
