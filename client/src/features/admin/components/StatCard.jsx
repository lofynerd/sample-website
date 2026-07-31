// Small metric tile used on the dashboard grid
export default function StatCard({ label, value, sublabel, icon: Icon }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-widest2 text-white/50">{label}</span>
        {Icon && <Icon size={16} strokeWidth={1.5} className="text-white/40" />}
      </div>
      <p className="font-display text-3xl">{value}</p>
      {sublabel && <p className="text-xs text-white/40 mt-1">{sublabel}</p>}
    </div>
  );
}
