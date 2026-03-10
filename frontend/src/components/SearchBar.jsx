import { useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { debounce } from '../utils/helpers';

export default function SearchBar() {
  const { applyFilter, filters } = useNotes();
  const [value, setValue] = useState(filters.search ?? '');
  const inputRef = useRef();

  const debouncedSearch = useRef(
    debounce((val) => applyFilter({ search: val }), 400)
  ).current;

  const handleChange = (e) => {
    setValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const clear = () => {
    setValue('');
    applyFilter({ search: '' });
    inputRef.current?.focus();
  };

  return (
    <div className="relative group w-full">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-ink-400 transition-colors pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search notes…"
        className="w-full h-8 bg-white/5 border border-white/[0.07] focus:border-ink-500/50 focus:bg-white/[0.07] rounded-lg pl-8 pr-8 text-sm text-white placeholder-white/25 outline-none transition-all focus:shadow-glow-sm"
      />
      {value && (
        <button
          onClick={clear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}