type SummaryCardProps = {
  title: string;
  amount: string;
  amountColor?: string;
};

function SummaryCard({
  title,
  amount,
  amountColor = "text-slate-900",
}: SummaryCardProps) {
  return (
    <section className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6a7c7b]">{title}</h3>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf7f1] text-sm text-[#13795b]">↗</span>
      </div>
        <p className={`mt-5 text-2xl font-extrabold tracking-tight ${amountColor === "positive" ? "text-[#13795b]" : amountColor === "negative" ? "text-[#c45b52]" : "text-[#102a2a]"}`}>
          {amount}
        </p>
    </section>
  );
}

export default SummaryCard;