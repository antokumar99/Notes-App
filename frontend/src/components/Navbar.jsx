import { useState } from 'react';
import { LayoutGrid, List, Plus, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import { initials } from '../utils/helpers';
import SearchBar from './SearchBar';

export default function Navbar({ onNewNote }) {
  const { user, logout } = useAuth();
  const { view, changeView } = useNotes();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 px-4 md:px-6 h-14 bg-[#0d0d14]/80 backdrop-blur-md border-b border-white/6">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-ink-600 flex items-center justify-center shadow-glow-sm">
          <span className="text-white text-xs font-bold font-mono">I</span>
        </div>
        <span className="hidden sm:block font-semibold text-white/90 text-sm tracking-tight">Inkwell</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <SearchBar />
      </div>

      {/* View toggle */}
      <div className="hidden sm:flex items-center bg-white/5 border border-white/8 rounded-lg overflow-hidden">
        <button
          onClick={() => changeView('grid')}
          className={`p-2 transition-colors ${view === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
          title="Grid view"
        >
          <LayoutGrid size={15} />
        </button>
        <button
          onClick={() => changeView('list')}
          className={`p-2 transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
          title="List view"
        >
          <List size={15} />
        </button>
      </div>

      {/* New note */}
      <button
        onClick={onNewNote}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-ink-600 hover:bg-ink-500 text-white text-sm font-medium rounded-lg transition-all hover:shadow-glow-sm active:scale-95"
      >
        <Plus size={15} />
        <span className="hidden sm:block">New</span>
      </button>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/6 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-ink-500 to-ink-700 flex items-center justify-center text-white text-xs font-semibold">
            {initials(user?.name)}
          </div>
          <ChevronDown size={13} className="text-white/40 hidden sm:block" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-10 z-50 w-52 py-1.5 bg-[#16161f] border border-white/8 rounded-xl shadow-modal animate-fade-in">
              <div className="px-4 py-2.5 border-b border-white/6">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-white/40 truncate">{user?.email}</p>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                <Settings size={14} /> Settings
              </button>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}