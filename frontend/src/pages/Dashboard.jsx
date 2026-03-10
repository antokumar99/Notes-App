import { useEffect, useState, useCallback } from 'react';
import {
  FileText, Pin, Archive, Trash2, Plus,
  Hash, LayoutGrid, List, Sparkles, Flame
} from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import TagFilter from '../components/TagFilter';

/* ── sidebar nav item ────────────────────────────────────────────── */
const NavItem = ({ icon: Icon, label, count, active, onClick, accent }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left
      ${active
        ? 'bg-white/8 text-white'
        : 'text-white/45 hover:text-white/75 hover:bg-white/5'}`}
  >
    <Icon size={15} className={active ? '' : 'opacity-70'} />
    <span className="flex-1">{label}</span>
    {count > 0 && (
      <span className={`text-xs px-1.5 py-0.5 rounded-md ${active ? 'bg-white/15 text-white/80' : 'bg-white/6 text-white/30'}`}>
        {count}
      </span>
    )}
  </button>
);

/* ── skeleton card ───────────────────────────────────────────────── */
const SkeletonCard = ({ delay = 0 }) => (
  <div className="rounded-2xl overflow-hidden" style={{ animationDelay: `${delay}ms` }}>
    <div className="skeleton h-40 rounded-2xl" />
  </div>
);

/* ── empty state ─────────────────────────────────────────────────── */
const EmptyState = ({ icon, title, sub, action, onAction }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center select-none">
    <div className="text-4xl mb-4 opacity-30">{icon}</div>
    <p className="font-semibold text-white/50 text-sm mb-1">{title}</p>
    <p className="text-white/25 text-xs mb-5">{sub}</p>
    {action && (
      <button
        onClick={onAction}
        className="flex items-center gap-1.5 px-4 py-2 bg-ink-600/80 hover:bg-ink-600 text-white text-xs font-semibold rounded-xl transition-all"
      >
        <Plus size={13} /> {action}
      </button>
    )}
  </div>
);

/* ── Dashboard ───────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth();
  const {
    items, pinned, regular, stats, tags,
    loading, view, filters,
    loadNotes, loadStats,
    addNote, saveNote, moveToTrash, restoreNote, permanentDelete, clearTrash,
    openNote, closeNote, activeNote,
    changeView, applyFilter, resetFilters,
  } = useNotes();

  const [editorOpen,  setEditorOpen]  = useState(false);
  const [editorNote,  setEditorNote]  = useState(null);
  const [isNew,       setIsNew]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── initial data ────────────────────────────────────────────── */
  useEffect(() => {
    loadNotes();
    loadStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  /* ── editor helpers ──────────────────────────────────────────── */
  const openNew = useCallback(() => {
    setEditorNote(null);
    setIsNew(true);
    setEditorOpen(true);
  }, []);

  const openExisting = useCallback((note) => {
    setEditorNote(note);
    setIsNew(false);
    setEditorOpen(true);
    openNote(note);
  }, [openNote]);

  const handleEditorClose = useCallback(() => {
    setEditorOpen(false);
    setEditorNote(null);
    closeNote();
    loadNotes();
    loadStats();
  }, [closeNote, loadNotes, loadStats]);

  const handleSave = useCallback(async (data) => {
    if (isNew) await addNote(data);
    else await saveNote(editorNote._id, data);
  }, [isNew, editorNote, addNote, saveNote]);

  /* ── quick actions ───────────────────────────────────────────── */
  const handlePin     = (id) => saveNote(id, { isPinned:   !items.find((n) => n._id === id)?.isPinned   }).then(loadNotes);
  const handleArchive = (id) => saveNote(id, { isArchived: !items.find((n) => n._id === id)?.isArchived }).then(() => { loadNotes(); loadStats(); });
  const handleTrash   = (id) => moveToTrash(id);
  const handleRestore = (id) => restoreNote(id);
  const handleDelete  = (id) => { if (window.confirm('Permanently delete?')) permanentDelete(id); };

  /* ── nav state ───────────────────────────────────────────────── */
  const navFilters = {
    all:      { search: '', tag: '', isArchived: false, isTrashed: false, isPinned: null },
    pinned:   { search: '', tag: '', isArchived: false, isTrashed: false, isPinned: true  },
    archived: { search: '', tag: '', isArchived: true,  isTrashed: false, isPinned: null  },
    trashed:  { search: '', tag: '', isArchived: false, isTrashed: true,  isPinned: null  },
  };
  const activeNav = filters.isTrashed ? 'trashed' : filters.isArchived ? 'archived' : filters.isPinned ? 'pinned' : 'all';

  const pageTitle = {
    all:      'All Notes',
    pinned:   'Pinned',
    archived: 'Archive',
    trashed:  'Trash',
  }[activeNav];

  /* ── sidebar ─────────────────────────────────────────────────── */
  const Sidebar = (
    <aside className="flex flex-col h-full bg-[#0d0d14] border-r border-white/6 w-60 shrink-0">
      <div className="p-4 border-b border-white/6">
        <button
          onClick={openNew}
          className="w-full flex items-center gap-2 justify-center h-9 bg-ink-600 hover:bg-ink-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-glow-ink active:scale-[0.97]"
        >
          <Plus size={15} /> New note
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <NavItem icon={FileText} label="All notes"  count={stats?.total    ?? 0} active={activeNav === 'all'}      onClick={() => applyFilter(navFilters.all)} />
        <NavItem icon={Pin}      label="Pinned"     count={stats?.pinned   ?? 0} active={activeNav === 'pinned'}   onClick={() => applyFilter(navFilters.pinned)} />
        <NavItem icon={Archive}  label="Archive"    count={stats?.archived ?? 0} active={activeNav === 'archived'} onClick={() => applyFilter(navFilters.archived)} />
        <NavItem icon={Trash2}   label="Trash"      count={stats?.trashed  ?? 0} active={activeNav === 'trashed'}  onClick={() => applyFilter(navFilters.trashed)} />

        {tags?.length > 0 && (
          <>
            <div className="pt-4 pb-1.5 px-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/20">Tags</span>
            </div>
            {tags.map(({ tag, count }) => (
              <NavItem
                key={tag}
                icon={Hash}
                label={`#${tag}`}
                count={count}
                active={filters.tag === tag}
                onClick={() => applyFilter({ tag: filters.tag === tag ? '' : tag, isTrashed: false, isArchived: false })}
              />
            ))}
          </>
        )}
      </nav>

      {/* stats footer */}
      <div className="p-4 border-t border-white/6">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/4 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-white">{stats?.total ?? '–'}</p>
            <p className="text-[10px] text-white/30">notes</p>
          </div>
          <div className="bg-white/4 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-white">{stats?.words ? `${(stats.words / 1000).toFixed(1)}k` : '–'}</p>
            <p className="text-[10px] text-white/30">words</p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="h-screen flex flex-col bg-[#0d0d14] overflow-hidden text-white font-body">
      <Navbar onNewNote={openNew} />

      <div className="flex flex-1 overflow-hidden">
        {/* desktop sidebar */}
        <div className="hidden lg:block shrink-0 w-60">
          {Sidebar}
        </div>

        {/* mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 bottom-0 z-40 w-60 lg:hidden">
              {Sidebar}
            </div>
          </>
        )}

        {/* main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* sub-header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-white/80 text-sm">{pageTitle}</h2>
              {items.length > 0 && (
                <span className="text-xs text-white/25">{items.length} notes</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* view toggle */}
              <div className="flex bg-white/4 border border-white/[0.07] rounded-lg overflow-hidden">
                <button onClick={() => changeView('grid')} className={`p-1.5 transition-colors ${view === 'grid' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
                  <LayoutGrid size={14} />
                </button>
                <button onClick={() => changeView('list')} className={`p-1.5 transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
                  <List size={14} />
                </button>
              </div>

              {/* empty trash button */}
              {activeNav === 'trashed' && items.length > 0 && (
                <button
                  onClick={() => { if (window.confirm('Empty trash? This cannot be undone.')) clearTrash(); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={12} /> Empty trash
                </button>
              )}
            </div>
          </div>

          {/* tag filter bar */}
          {tags?.length > 0 && !filters.isTrashed && (
            <div className="px-5 py-2 border-b border-white/4">
              <TagFilter />
            </div>
          )}

          {/* notes */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {loading ? (
              <div className={view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'
                : 'flex flex-col gap-2'}>
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} delay={i * 60} />)}
              </div>
            ) : items.length === 0 ? (
              <div className={view === 'grid' ? 'grid' : ''}>
                <EmptyState
                  icon={activeNav === 'trashed' ? '🗑️' : activeNav === 'archived' ? '📦' : '📝'}
                  title={activeNav === 'trashed' ? 'Trash is empty' : activeNav === 'archived' ? 'No archived notes' : 'No notes yet'}
                  sub={activeNav === 'all' ? 'Create your first note to get started' : ''}
                  action={activeNav === 'all' ? 'New note' : null}
                  onAction={openNew}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* pinned */}
                {pinned.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Pin size={12} className="text-amber-400" />
                      <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Pinned</span>
                    </div>
                    <div className={view === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'
                      : 'flex flex-col gap-2'}>
                      {pinned.map((note) => (
                        <NoteCard key={note._id} note={note} view={view}
                          onClick={openExisting} onPin={handlePin}
                          onArchive={handleArchive} onTrash={handleTrash}
                          onRestore={handleRestore} onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* others */}
                {regular.length > 0 && (
                  <section>
                    {pinned.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <FileText size={12} className="text-white/30" />
                        <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Other notes</span>
                      </div>
                    )}
                    <div className={view === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'
                      : 'flex flex-col gap-2'}>
                      {regular.map((note) => (
                        <NoteCard key={note._id} note={note} view={view}
                          onClick={openExisting} onPin={handlePin}
                          onArchive={handleArchive} onTrash={handleTrash}
                          onRestore={handleRestore} onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Editor modal */}
      {editorOpen && (
        <NoteEditor
          note={editorNote}
          isNew={isNew}
          onClose={handleEditorClose}
        />
      )}
    </div>
  );
}