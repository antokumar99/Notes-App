import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notesApi } from '../api/notesApi';

/* ── thunks ──────────────────────────────────────────────────────── */
export const fetchNotes = createAsyncThunk(
  'notes/fetchAll',
  async (params, { rejectWithValue }) => {
    try { return (await notesApi.getAll(params)).data; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

export const fetchStats = createAsyncThunk(
  'notes/fetchStats',
  async (_, { rejectWithValue }) => {
    try { return (await notesApi.getStats()).data; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

export const fetchNoteById = createAsyncThunk(
  'notes/fetchById',
  async (id, { rejectWithValue }) => {
    try { return (await notesApi.getById(id)).data; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

export const createNote = createAsyncThunk(
  'notes/create',
  async (data, { rejectWithValue }) => {
    try { return (await notesApi.create(data)).data.note; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

export const updateNote = createAsyncThunk(
  'notes/update',
  async ({ id, data }, { rejectWithValue }) => {
    try { return (await notesApi.update(id, data)).data.note; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

export const trashNote = createAsyncThunk(
  'notes/trash',
  async (id, { rejectWithValue }) => {
    try { return (await notesApi.toggleTrash(id)).data; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/delete',
  async (id, { rejectWithValue }) => {
    try { await notesApi.delete(id); return id; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

export const emptyTrash = createAsyncThunk(
  'notes/emptyTrash',
  async (_, { rejectWithValue }) => {
    try { return (await notesApi.emptyTrash()).data; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

export const bulkUpdate = createAsyncThunk(
  'notes/bulkUpdate',
  async ({ ids, update }, { rejectWithValue }) => {
    try { return (await notesApi.bulkUpdate(ids, update)).data; }
    catch (err) { return rejectWithValue(err.response?.data?.message); }
  }
);

/* ── slice ───────────────────────────────────────────────────────── */
const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    items:      [],
    stats:      null,   // { total, pinned, archived, trashed, words }
    tags:       [],     // [{ tag, count }]
    pagination: null,
    loading:    false,
    error:      null,
    activeNote: null,   // note open in editor
    view:       'grid', // 'grid' | 'list'
    filters: {
      search:     '',
      tag:        '',
      isArchived: false,
      isTrashed:  false,
      isPinned:   null,
    },
    selected:   [],     // ids of bulk-selected notes
  },
  reducers: {
    setActiveNote(s, a)  { s.activeNote = a.payload; },
    setView(s, a)        { s.view = a.payload; },
    setFilters(s, a)     { s.filters = { ...s.filters, ...a.payload }; },
    resetFilters(s)      { s.filters = { search: '', tag: '', isArchived: false, isTrashed: false, isPinned: null }; },
    setSelected(s, a)    { s.selected = a.payload; },
    toggleSelected(s, a) {
      s.selected = s.selected.includes(a.payload)
        ? s.selected.filter((id) => id !== a.payload)
        : [...s.selected, a.payload];
    },
    clearSelected(s)     { s.selected = []; },
    clearError(s)        { s.error = null; },
  },
  extraReducers(builder) {
    /* fetchNotes */
    builder
      .addCase(fetchNotes.pending,  (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNotes.fulfilled, (s, a) => {
        s.loading    = false;
        s.items      = a.payload.notes;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchNotes.rejected, (s, a) => { s.loading = false; s.error = a.payload; });

    /* fetchStats */
    builder.addCase(fetchStats.fulfilled, (s, a) => {
      s.stats = a.payload.counts;
      s.tags  = a.payload.tags;
    });

    /* fetchNoteById */
    builder.addCase(fetchNoteById.fulfilled, (s, a) => {
      s.activeNote = a.payload.note;
    });

    /* createNote */
    builder.addCase(createNote.fulfilled, (s, a) => {
      s.items.unshift(a.payload);
      s.activeNote = a.payload;
    });

    /* updateNote */
    builder.addCase(updateNote.fulfilled, (s, a) => {
      const idx = s.items.findIndex((n) => n._id === a.payload._id);
      if (idx !== -1) s.items[idx] = a.payload;
      if (s.activeNote?._id === a.payload._id) s.activeNote = a.payload;
    });

    /* trashNote */
    builder.addCase(trashNote.fulfilled, (s, a) => {
      s.items = s.items.filter((n) => n._id !== a.payload.note._id);
      if (s.activeNote?._id === a.payload.note._id) s.activeNote = null;
    });

    /* deleteNote */
    builder.addCase(deleteNote.fulfilled, (s, a) => {
      s.items = s.items.filter((n) => n._id !== a.payload);
      if (s.activeNote?._id === a.payload) s.activeNote = null;
    });

    /* emptyTrash */
    builder.addCase(emptyTrash.fulfilled, (s) => {
      s.items = s.items.filter((n) => !n.isTrashed);
    });
  },
});

export const {
  setActiveNote, setView, setFilters, resetFilters,
  setSelected, toggleSelected, clearSelected, clearError,
} = notesSlice.actions;

export default notesSlice.reducer;