import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Pin, Archive, Trash2 } from 'lucide-react';
import { fetchNoteById } from '../store/notesSlice';
import { useNotes } from '../hooks/useNotes';
import { relativeDate, countWords, getNoteColor, stripHtml } from '../utils/helpers';

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeNote: note, saveNote, moveToTrash } = useNotes();

  useEffect(() => { dispatch(fetchNoteById(id)); }, [id, dispatch]);

  if (!note) {
    return (
      <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { accent, border } = getNoteColor(note.color);
  const plain = stripHtml(note.content);

  return (
    <div className="min-h-screen bg-[#0d0d14] flex flex-col">
      {/* top bar */}
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 md:px-8 h-14 bg-[#0d0d14]/90 backdrop-blur-md border-b border-white/6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => saveNote(note._id, { isPinned: !note.isPinned })}
            className={`p-2 rounded-lg transition-all ${note.isPinned ? 'text-amber-400 bg-amber-400/10' : 'text-white/40 hover:text-white/70 hover:bg-white/6'}`}
          >
            <Pin size={15} />
          </button>
          <button
            onClick={() => saveNote(note._id, { isArchived: !note.isArchived })}
            className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/6 transition-all"
          >
            <Archive size={15} />
          </button>
          <button
            onClick={() => { moveToTrash(note._id); navigate(-1); }}
            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        <div className="h-0.5 w-16 rounded-full mb-8 opacity-80" style={{ background: accent }} />

        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{note.title || 'Untitled'}</h1>

        <div className="flex items-center gap-4 mb-8 text-xs text-white/30">
          <span>Updated {relativeDate(note.updatedAt)}</span>
          {plain && <span>{countWords(note.content)} words</span>}
        </div>

        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {note.tags.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: `${accent}25`, color: accent }}>
                #{t}
              </span>
            ))}
          </div>
        )}

        {note.content && (
          <div className="text-[0.9375rem] text-white/65 leading-[1.85] whitespace-pre-wrap">
            {plain}
          </div>
        )}

        {note.checklist?.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-4">Checklist</p>
            {note.checklist.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 ${item.done ? 'opacity-40' : ''}`}>
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${item.done ? 'border-transparent' : 'border-white/20'}`}
                  style={{ background: item.done ? accent : 'transparent' }}>
                  {item.done && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>
                <span className={`text-sm ${item.done ? 'line-through text-white/30' : 'text-white/70'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}