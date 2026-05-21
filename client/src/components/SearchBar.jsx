import { Search, X } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useTask } from '../context/TaskContext';

function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

export default function SearchBar({ placeholder = 'Search tasks...' }) {
  const { updateFilters } = useTask();
  const [value, setValue] = useState('');

  const debouncedSearch = useCallback(
    debounce((q) => updateFilters({ search: q }), 400),
    [updateFilters]
  );

  const handleChange = (e) => {
    setValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleClear = () => {
    setValue('');
    updateFilters({ search: '' });
  };

  return (
    <div className="relative flex items-center">
      <Search size={16} className="absolute left-3.5 text-slate-500 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-field pl-10 pr-10 py-2.5"
      />
      {value && (
        <button onClick={handleClear} className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors">
          <X size={15} />
        </button>
      )}
    </div>
  );
}
