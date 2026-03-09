const NOTE_COLORS = [
  { id: "zinc", bg: "#18181b", accent: "#71717a" },
  { id: "blue", bg: "#0f172a", accent: "#3b82f6" },
  { id: "violet", bg: "#1e1b4b", accent: "#8b5cf6" },
  { id: "rose", bg: "#1c0a0a", accent: "#f43f5e" },
  { id: "amber", bg: "#1c1204", accent: "#f59e0b" },
  { id: "emerald", bg: "#022c22", accent: "#10b981" },
  { id: "sky", bg: "#0c1a2e", accent: "#0ea5e9" },
  { id: "pink", bg: "#2d0a1e", accent: "#ec4899" },
];

const NOTE_COLOR_IDS = NOTE_COLORS.map((c) => c.id);

module.exports = {
  NOTE_COLORS,
  NOTE_COLOR_IDS,
  MAX_TAGS_PER_NOTE: 10,
  MAX_TITLE_LENGTH: 200,
  MAX_CONTENT_LENGTH: 50000,
  TRASH_AUTO_DELETE_DAYS: 30,
};
