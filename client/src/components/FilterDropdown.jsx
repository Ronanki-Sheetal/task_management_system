import { useTask } from '../context/TaskContext';
import { Filter, ChevronDown } from 'lucide-react';

const STATUSES = ['', 'pending', 'in-progress', 'completed', 'cancelled'];
const PRIORITIES = ['', 'low', 'medium', 'high', 'urgent'];
const CATEGORIES = ['', 'General', 'Development', 'Design', 'Marketing', 'Research', 'Testing', 'DevOps', 'Management', 'Other'];
const SORTS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'dueDate-asc', label: 'Due Date' },
  { value: 'priority-desc', label: 'Priority' },
  { value: 'title-asc', label: 'Title A-Z' },
];

const Select = ({ label, value, onChange, options }) => (
  <div className="relative flex items-center gap-1">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="appearance-none text-sm font-medium rounded-xl px-3 py-2 pr-7 transition-all cursor-pointer"
      style={{
        background: value ? 'rgba(6,182,212,0.12)' : 'rgba(30,41,59,0.7)',
        border: value ? '1px solid rgba(6,182,212,0.4)' : '1px solid rgba(255,255,255,0.08)',
        color: value ? '#06B6D4' : '#94A3B8',
        outline: 'none',
      }}
    >
      <option value="">{label}</option>
      {options.filter(Boolean).map(o => (
        <option key={o.value || o} value={o.value || o}>
          {o.label || (o.charAt(0).toUpperCase() + o.slice(1))}
        </option>
      ))}
    </select>
    <ChevronDown size={12} className="absolute right-2 pointer-events-none text-slate-500" />
  </div>
);

export default function FilterDropdown() {
  const { filters, updateFilters, resetFilters } = useTask();
  const hasFilters = filters.status || filters.priority || filters.category || filters.search;

  const handleSort = (val) => {
    const [sortBy, order] = val.split('-');
    updateFilters({ sortBy, order });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Filter size={15} className="text-slate-500" />

      <Select
        label="Status"
        value={filters.status}
        onChange={(v) => updateFilters({ status: v })}
        options={STATUSES.slice(1)}
      />
      <Select
        label="Priority"
        value={filters.priority}
        onChange={(v) => updateFilters({ priority: v })}
        options={PRIORITIES.slice(1)}
      />
      <Select
        label="Category"
        value={filters.category}
        onChange={(v) => updateFilters({ category: v })}
        options={CATEGORIES.slice(1)}
      />
      <Select
        label="Sort By"
        value={`${filters.sortBy}-${filters.order}`}
        onChange={handleSort}
        options={SORTS}
      />

      {hasFilters && (
        <button
          onClick={resetFilters}
          className="text-xs font-semibold px-3 py-2 rounded-xl transition-all"
          style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          Clear All
        </button>
      )}
    </div>
  );
}
