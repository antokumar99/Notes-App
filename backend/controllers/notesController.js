const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Note = require('../models/Note.js');

/* ── GET /api/notes ──────────────────────────────────────────────── */
const getNotes = asyncHandler(async (req, res) => {
  const {
    search,
    tag,
    color,
    isPinned,
    isArchived = 'false',
    isTrashed  = 'false',
    sort       = '-updatedAt',
    page       = 1,
    limit      = 24,
  } = req.query;

  const query = {
    user:       req.user._id,
    isArchived: isArchived === 'true',
    isTrashed:  isTrashed  === 'true',
  };

  if (search)                    query.$text     = { $search: search };
  if (tag)                       query.tags      = tag.toLowerCase();
  if (color)                     query.color     = color;
  if (isPinned !== undefined)    query.isPinned  = isPinned === 'true';

  const skip = (Number(page) - 1) * Number(limit);

  const [notes, total] = await Promise.all([
    Note.find(query).sort(sort).skip(skip).limit(Number(limit)).lean(),
    Note.countDocuments(query),
  ]);

  res.json({
    success: true,
    notes,
    pagination: {
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
});

/* ── GET /api/notes/stats ────────────────────────────────────────── */
const getStats = asyncHandler(async (req, res) => {
  const uid = req.user._id;

  const [counts, tags] = await Promise.all([
    Note.aggregate([
      { $match: { user: uid } },
      {
        $group: {
          _id:      null,
          total:    { $sum: 1 },
          pinned:   { $sum: { $cond: ['$isPinned',   1, 0] } },
          archived: { $sum: { $cond: ['$isArchived', 1, 0] } },
          trashed:  { $sum: { $cond: ['$isTrashed',  1, 0] } },
          words:    { $sum: '$wordCount' },
        },
      },
    ]),
    Note.aggregate([
      { $match: { user: uid, isTrashed: false } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort:  { count: -1 } },
      { $limit: 20 },
      { $project: { tag: '$_id', count: 1, _id: 0 } },
    ]),
  ]);

  res.json({ success: true, counts: counts[0] || {}, tags });
});

/* ── GET /api/notes/:id ──────────────────────────────────────────── */
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) { res.status(404); throw new Error('Note not found'); }
  res.json({ success: true, note });
});

/* ── POST /api/notes ─────────────────────────────────────────────── */
const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags, color, checklist, reminder } = req.body;

  const note = await Note.create({
    user:      req.user._id,
    title:     title     ?? 'Untitled',
    content:   content   ?? '',
    tags:      tags      ?? [],
    color:     color     ?? 'zinc',
    checklist: checklist ?? [],
    reminder:  reminder  ?? null,
  });

  res.status(201).json({ success: true, note });
});

/* ── PUT /api/notes/:id ──────────────────────────────────────────── */
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) { res.status(404); throw new Error('Note not found'); }

  const fields = ['title', 'content', 'tags', 'color', 'isPinned', 'isArchived', 'checklist', 'reminder'];
  for (const f of fields) {
    if (req.body[f] !== undefined) note[f] = req.body[f];
  }

  await note.save();
  res.json({ success: true, note });
});

/* ── PUT /api/notes/:id/trash ────────────────────────────────────── */
const toggleTrash = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) { res.status(404); throw new Error('Note not found'); }

  note.isTrashed = !note.isTrashed;
  note.trashedAt = note.isTrashed ? new Date() : null;
  if (note.isTrashed) {
    note.isPinned   = false;
    note.isArchived = false;
  }
  await note.save();

  res.json({
    success: true,
    note,
    message: note.isTrashed ? 'Moved to trash' : 'Restored from trash',
  });
});

/* ── DELETE /api/notes/:id ───────────────────────────────────────── */
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) { res.status(404); throw new Error('Note not found'); }

  await note.deleteOne();
  res.json({ success: true, message: 'Note permanently deleted', id: req.params.id });
});

/* ── DELETE /api/notes/trash/empty ──────────────────────────────── */
const emptyTrash = asyncHandler(async (req, res) => {
  const result = await Note.deleteMany({ user: req.user._id, isTrashed: true });
  res.json({
    success: true,
    message: `${result.deletedCount} note(s) permanently deleted`,
    deletedCount: result.deletedCount,
  });
});

/* ── PUT /api/notes/bulk ─────────────────────────────────────────── */
const bulkUpdate = asyncHandler(async (req, res) => {
  const { ids, update } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400); throw new Error('ids array is required');
  }

  // Validate all ids are valid ObjectIds
  const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

  const result = await Note.updateMany(
    { _id: { $in: validIds }, user: req.user._id },
    { $set: update }
  );

  res.json({ success: true, modifiedCount: result.modifiedCount });
});

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  toggleTrash,
  getStats,
  emptyTrash,
  bulkUpdate
};