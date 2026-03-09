const mongoose = require('mongoose');
const { NOTE_COLOR_IDS, MAX_TITLE_LENGTH, MAX_CONTENT_LENGTH, MAX_TAGS_PER_NOTE } = require('../config/constants.js');

/* ── sub-schemas ──────────────────────────────────────────────────── */
const checklistItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 500 },
    done: { type: Boolean, default: false },
  },
  { _id: true }
);

/* ── main schema ─────────────────────────────────────────────────── */
const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [MAX_TITLE_LENGTH, `Title cannot exceed ${MAX_TITLE_LENGTH} chars`],
      default: 'Untitled',
    },
    content: {
      type: String,
      default: '',
      maxlength: [MAX_CONTENT_LENGTH, `Content cannot exceed ${MAX_CONTENT_LENGTH} chars`],
    },
    tags: {
      type: [{ type: String, trim: true, lowercase: true }],
      validate: {
        validator: (v) => v.length <= MAX_TAGS_PER_NOTE,
        message: `Cannot have more than ${MAX_TAGS_PER_NOTE} tags`,
      },
    },
    color: {
      type: String,
      enum: NOTE_COLOR_IDS,
      default: 'zinc',
    },
    isPinned:    { type: Boolean, default: false, index: true },
    isArchived:  { type: Boolean, default: false, index: true },
    isTrashed:   { type: Boolean, default: false, index: true },
    trashedAt:   { type: Date,    default: null },
    checklist:   [checklistItemSchema],
    reminder:    { type: Date, default: null },
    wordCount:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* ── compound index for text search ─────────────────────────────── */
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

/* ── compound index for fast user queries ────────────────────────── */
noteSchema.index({ user: 1, isTrashed: 1, isArchived: 1, updatedAt: -1 });

/* ── auto word-count ─────────────────────────────────────────────── */
noteSchema.pre('save', function (next) {
  if (this.isModified('content') && this.content) {
    const plain = this.content.replace(/<[^>]+>/g, '');
    this.wordCount = plain.trim().split(/\s+/).filter(Boolean).length;
  }
  next();
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;