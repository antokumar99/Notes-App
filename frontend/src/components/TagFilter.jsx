import { Hash, X } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';

export default function TagFilter() {
  const { tags, filters, applyFilter } = useNotes();

  if (!tags?.length) return null;

  const active = filters.tag;

  const toggle = (tag) => applyFilter({ tag: active === tag ? '' : tag });

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <Hash size={13} className="text-white/30 shrink-0" />
      <div className="flex items-center gap-1.5 flex-nowrap">
        {tags.map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              active === tag
                ? 'bg-ink-600 text-white shadow-glow-sm'
                : 'bg-white/5 text-white/50 border border-white/[0.07] hover:bg-white/9 hover:text-white/80'
            }`}
          >
            #{tag}
            <span className={`text-[10px] ${active === tag ? 'text-white/70' : 'text-white/30'}`}>{count}</span>
            {active === tag && <X size={10} className="ml-0.5" />}
          </button>
        ))}
      </div>
    </div>
  );
}