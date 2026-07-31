// Consistent header used across admin pages: title, description, and an action slot
export default function AdminPageHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between px-8 py-8 border-b border-white/10">
      <div>
        <h1 className="font-display text-2xl">{title}</h1>
        {description && <p className="text-sm text-white/50 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
