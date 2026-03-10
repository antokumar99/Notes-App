import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

/** Pretty-print a date relative to now */
export const relativeDate = (dateStr) => {
  const d = new Date(dateStr);
  if (isToday(d))     return formatDistanceToNow(d, { addSuffix: true });
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
};

/** Strip HTML tags from a string */
export const stripHtml = (html = '') => html.replace(/<[^>]+>/g, '');

/** Count words in a string */
export const countWords = (text = '') =>
  stripHtml(text).trim().split(/\s+/).filter(Boolean).length;

/** Truncate string to maxLen, appending ellipsis */
export const truncate = (str = '', maxLen = 120) =>
  str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;

/** Debounce a function */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/** Generate initials from a name */
export const initials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

/** Note color map */
export const NOTE_COLORS = [
  { id: 'zinc',    label: 'Zinc',    bg: '#18181b', border: '#3f3f46', accent: '#a1a1aa' },
  { id: 'blue',    label: 'Blue',    bg: '#0f172a', border: '#1e3a5f', accent: '#3b82f6' },
  { id: 'violet',  label: 'Violet',  bg: '#1e1b4b', border: '#3730a3', accent: '#8b5cf6' },
  { id: 'rose',    label: 'Rose',    bg: '#1c0a0a', border: '#7f1d1d', accent: '#f43f5e' },
  { id: 'amber',   label: 'Amber',   bg: '#1c1204', border: '#78350f', accent: '#f59e0b' },
  { id: 'emerald', label: 'Emerald', bg: '#022c22', border: '#064e3b', accent: '#10b981' },
  { id: 'sky',     label: 'Sky',     bg: '#0c1a2e', border: '#0c4a6e', accent: '#0ea5e9' },
  { id: 'pink',    label: 'Pink',    bg: '#2d0a1e', border: '#831843', accent: '#ec4899' },
];

export const getNoteColor = (id = 'zinc') =>
  NOTE_COLORS.find((c) => c.id === id) ?? NOTE_COLORS[0];