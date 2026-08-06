import { Search } from 'lucide-react';

// Debounced-by-caller search box used across admin list pages
export default function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative max-w-xs">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-white/40"
      />
    </div>
  );
}
