import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Plus, Minus, Check, AlignLeft, CheckSquare, Tag } from 'lucide-react';
import { countWords, getNoteColor, NOTE_COLORS, relativeDate } from '../utils/helpers';
import { useNotes } from '../hooks/useNotes';

/* ── small sub-components ────────────────────────────────────────── */
const ToolbarBtn = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    title={label}
    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
      ${active ? 'bg-ink-600/40 text-ink-300' : 'text-white/50 hover:bg-white/[0.07] hover:text-white/80'}`}
  >
    <Icon size={13} /> {label}
  </button>
);

/* ── main component ──────────────────────────────────────────────── */
export default function NoteEditor({ note = null, isNew = false, onClose }) {
  const { addNote, saveNote } = useNotes();

  const [form, setForm] = useState({
    title:     note?.title     ?? '',
    content:   note?.content   ?? '',
    tags:      note?.tags      ?? [],
    color:     note?.color     ?? 'zinc',
    checklist: note?.checklist ?? [],
  });
  const [mode,          setMode]          = useState(note?.checklist?.length ? 'checklist' : 'text');
  const [tagInput,      setTagInput]      = useState('');
  const [checkInput,    setCheckInput]    = useState('');
  const [saving,        setSaving]        = useState(false);
  const [saved,         setSaved]         = useState(false);
  const isDirty = useRef(false);
  const autoTimer = useRef(null);

  /* ── auto-save ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!isDirty.current || isNew) return;
    clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => persist(true), 1800);
    return () => clearTimeout(autoTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const set = useCallback((field, value) => {
    isDirty.current = true;
    setSaved(false);
    setForm((f) => ({ ...f, [field]: value }));
  }, []);

  /* ── persist ─────────────────────────────────────────────────── */
  const persist = useCallback(async (auto = false) => {
    if (!isDirty.current && !isNew) return;
    setSaving(true);
    if (isNew) {
      await addNote(form);
    } else {
      await saveNote(note._id, form);
    }
    isDirty.current = false;
    setSaving(false);
    setSaved(true);
    if (!auto) onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, isNew, note]);

  /* ── tag handling ────────────────────────────────────────────── */
  const commitTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
    setTagInput('');
  };
  const removeTag = (t) => set('tags', form.tags.filter((x) => x !== t));

  /* ── checklist ───────────────────────────────────────────────── */
  const addItem = () => {
    if (!checkInput.trim()) return;
    set('checklist', [...form.checklist, { text: checkInput.trim(), done: false }]);
    setCheckInput('');
  };
  const toggleItem = (i) =>
    set('checklist', form.checklist.map((item, idx) => idx === i ? { ...item, done: !item.done } : item));
  const removeItem = (i) =>
    set('checklist', form.checklist.filter((_, idx) => idx !== i));
  const editItem = (i, text) =>
    set('checklist', form.checklist.map((item, idx) => idx === i ? { ...item, text } : item));

  const { accent, border } = getNoteColor(form.color);
  const words = countWords(form.content);
  const doneCnt = form.checklist.filter((i) => i.done).length;

  /* ── backdrop click ──────────────────────────────────────────── */
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) { persist(false); onClose(); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdrop}
    >
      <div
        className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl shadow-modal border animate-slide-up overflow-hidden"
        style={{ background: '#13131c', borderColor: border, borderTopColor: accent, borderTopWidth: 2 }}
      >
        {/* ── title bar ────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.07]">
          <input
            autoFocus={isNew}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Note title…"
            className="flex-1 bg-transparent text-base font-semibold text-white placeholder-white/20 outline-none"
          />
          <div className="flex items-center gap-2 shrink-0">
            {saving && <span className="text-[11px] text-white/30 animate-pulse">Saving…</span>}
            {saved  && <span className="text-[11px] text-emerald-400/70">Saved</span>}
            <button onClick={() => { persist(false); onClose(); }} className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.07] transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── toolbar ──────────────────────────────────────────── */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-white/6 flex-wrap">
          <ToolbarBtn icon={AlignLeft}   label="Text"      active={mode === 'text'}      onClick={() => setMode('text')} />
          <ToolbarBtn icon={CheckSquare} label="Checklist" active={mode === 'checklist'} onClick={() => setMode('checklist')} />
          <ToolbarBtn icon={Tag}         label="Tags"      active={false}               onClick={() => document.getElementById('tag-input')?.focus()} />

          {/* color picker */}
          <div className="flex items-center gap-1.5 ml-auto">
            {NOTE_COLORS.map((c) => (
              <button
                key={c.id}
                title={c.label}
                onClick={() => set('color', c.id)}
                className={`w-4 h-4 rounded-full transition-transform ${form.color === c.id ? 'scale-125 ring-1 ring-white/40 ring-offset-1 ring-offset-[#13131c]' : 'hover:scale-110'}`}
                style={{ background: c.accent }}
              />
            ))}
          </div>
        </div>

        {/* ── body ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
          {mode === 'text' ? (
            <textarea
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              placeholder="Start writing…"
              className="w-full min-h-55 bg-transparent text-sm text-white/75 leading-relaxed placeholder-white/20 outline-none resize-none font-body"
            />
          ) : (
            <div className="space-y-0.5">
              {form.checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2 border-b border-white/5 last:border-0">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleItem(i)}
                    className="w-4 h-4 accent-ink-500 shrink-0 cursor-pointer"
                  />
                  <input
                    value={item.text}
                    onChange={(e) => editItem(i, e.target.value)}
                    className={`flex-1 bg-transparent text-sm outline-none ${item.done ? 'line-through text-white/30' : 'text-white/75'}`}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                  />
                  <button onClick={() => removeItem(i)} className="text-white/20 hover:text-red-400 transition-colors shrink-0">
                    <Minus size={13} />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2.5 pt-2">
                <div className="w-4 h-4 shrink-0" />
                <input
                  value={checkInput}
                  onChange={(e) => setCheckInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                  placeholder="Add item…"
                  className="flex-1 bg-transparent text-sm text-white/50 placeholder-white/20 outline-none"
                />
                <button onClick={addItem} className="text-ink-400 hover:text-ink-300 transition-colors shrink-0">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── tag input ────────────────────────────────────────── */}
        <div className="px-5 py-2.5 border-t border-white/6 flex flex-wrap items-center gap-1.5 min-h-11">
          <span className="text-white/20 text-xs">#</span>
          {form.tags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: `${accent}25`, color: accent }}
            >
              {t}
              <button onClick={() => removeTag(t)} className="hover:opacity-70 transition-opacity">
                <X size={9} />
              </button>
            </span>
          ))}
          <input
            id="tag-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commitTag(); }
              if (e.key === 'Backspace' && !tagInput) removeTag(form.tags.at(-1));
            }}
            placeholder={form.tags.length ? '' : 'Add tags…'}
            className="flex-1 min-w-20 bg-transparent text-xs text-white/60 placeholder-white/20 outline-none"
          />
        </div>

        {/* ── footer ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/6 bg-white/2">
          <div className="flex items-center gap-3 text-[11px] text-white/25">
            {note?.updatedAt && <span>Updated {relativeDate(note.updatedAt)}</span>}
            {mode === 'text'      && words > 0         && <span>{words} words</span>}
            {mode === 'checklist' && form.checklist.length > 0 && <span>{doneCnt}/{form.checklist.length} done</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { isDirty.current = false; onClose(); }}
              className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/6 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => persist(false)}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              style={{ background: accent }}
            >
              <Check size={13} />
              {isNew ? 'Create' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}