import { Pin, Archive, Trash2, RotateCcw, Trash, CheckSquare } from 'lucide-react';
import { relativeDate, stripHtml, truncate, getNoteColor } from '../utils/helpers';

/* ── action button ───────────────────────────────────────────────── */
const ActionBtn = ({ icon: Icon, label, onClick, danger = false }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    title={label}
    className={`p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100
      ${danger
        ? 'hover:bg-red-500/20 text-white/40 hover:text-red-400'
        : 'hover:bg-white/10 text-white/40 hover:text-white/90'}`}
  >
    <Icon size={13} />
  </button>
);

/* ── grid card ───────────────────────────────────────────────────── */
function GridCard({ note, onClick, actions }) {
  const { bg, border, accent } = getNoteColor(note.color);
  const plain = stripHtml(note.content);

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl p-4 cursor-pointer border transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover animate-fade-up"
      style={{ background: bg, borderColor: border }}
    >
      {/* accent top bar */}
      <div className="absolute top-0 left-4 right-4 h-0.5 rounded-full opacity-60" style={{ background: accent }} />

      {/* header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-[0.875rem] text-white/90 leading-snug line-clamp-2 flex-1">
          {note.title || 'Untitled'}
        </h3>
        {note.isPinned && <Pin size={13} style={{ color: accent }} className="shrink-0 mt-0.5" />}
      </div>

      {/* content preview */}
      {plain && (
        <p className="text-xs text-white/45 leading-relaxed line-clamp-4 mb-3">
          {truncate(plain, 200)}
        </p>
      )}

      {/* checklist preview */}
      {note.checklist?.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3">
          <CheckSquare size={11} className="text-white/30" />
          <span className="text-[11px] text-white/40">
            {note.checklist.filter((i) => i.done).length}/{note.checklist.length} done
          </span>
        </div>
      )}

      {/* tags */}
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 4).map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded-md text-[10px] font-medium"
              style={{ background: `${accent}22`, color: accent }}>
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/6">
        <span className="text-[10px] text-white/25">{relativeDate(note.updatedAt)}</span>
        <div className="flex items-center gap-0.5">
          {actions}
        </div>
      </div>
    </div>
  );
}

/* ── list row ────────────────────────────────────────────────────── */
function ListRow({ note, onClick, actions }) {
  const { accent } = getNoteColor(note.color);
  const plain = stripHtml(note.content);

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-white/6 bg-white/3 hover:bg-white/5.5 hover:border-white/10 cursor-pointer transition-all animate-fade-up"
    >
      <div className="w-1.5 h-10 rounded-full shrink-0" style={{ background: accent }} />
      {note.isPinned && <Pin size={12} className="shrink-0 text-amber-400" />}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90 truncate">{note.title || 'Untitled'}</p>
        {plain && <p className="text-xs text-white/35 truncate">{plain}</p>}
      </div>
      {note.tags?.length > 0 && (
        <span className="hidden sm:block text-xs px-2 py-0.5 rounded-md shrink-0"
          style={{ background: `${accent}22`, color: accent }}>
          #{note.tags[0]}
          {note.tags.length > 1 && ` +${note.tags.length - 1}`}
        </span>
      )}
      <span className="hidden md:block text-[11px] text-white/25 shrink-0 w-20 text-right">
        {relativeDate(note.updatedAt)}
      </span>
      <div className="flex items-center gap-0.5 shrink-0">{actions}</div>
    </div>
  );
}

/* ── NoteCard (public) ───────────────────────────────────────────── */
export default function NoteCard({ note, view = 'grid', onPin, onArchive, onTrash, onRestore, onDelete, onClick }) {
  const isTrashed = note.isTrashed;

  const actions = isTrashed ? (
    <>
      <ActionBtn icon={RotateCcw} label="Restore"          onClick={() => onRestore(note._id)} />
      <ActionBtn icon={Trash}     label="Delete forever"   onClick={() => onDelete(note._id)} danger />
    </>
  ) : (
    <>
      <ActionBtn icon={Pin}     label={note.isPinned ? 'Unpin' : 'Pin'}         onClick={() => onPin(note._id)} />
      <ActionBtn icon={Archive} label={note.isArchived ? 'Unarchive' : 'Archive'} onClick={() => onArchive(note._id)} />
      <ActionBtn icon={Trash2}  label="Move to trash"                           onClick={() => onTrash(note._id)} danger />
    </>
  );

  const props = { note, onClick: () => onClick(note), actions };

  return view === 'list' ? <ListRow {...props} /> : <GridCard {...props} />;
}