import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  fetchNotes, fetchStats, createNote, updateNote,
  trashNote, deleteNote, emptyTrash, bulkUpdate,
  setActiveNote, setView, setFilters, resetFilters,
  toggleSelected, clearSelected,
} from '../store/notesSlice';

/**
 * Convenience hook that surfaces notes state and actions.
 * Wraps every write action with toast feedback.
 */
export const useNotes = () => {
  const dispatch = useDispatch();
  const state    = useSelector((s) => s.notes);

  /* ── queries ─────────────────────────────────────────────────── */
  const loadNotes = useCallback(
    (extra = {}) => dispatch(fetchNotes({ ...state.filters, ...extra })),
    [dispatch, state.filters]
  );

  const loadStats = useCallback(() => dispatch(fetchStats()), [dispatch]);

  /* ── mutations ───────────────────────────────────────────────── */
  const addNote = useCallback(async (data) => {
    const res = await dispatch(createNote(data));
    if (createNote.fulfilled.match(res)) {
      toast.success('Note created');
      loadStats();
    } else toast.error(res.payload ?? 'Failed to create note');
    return res;
  }, [dispatch, loadStats]);

  const saveNote = useCallback(async (id, data) => {
    const res = await dispatch(updateNote({ id, data }));
    if (!updateNote.fulfilled.match(res)) toast.error(res.payload ?? 'Failed to save');
    return res;
  }, [dispatch]);

  const moveToTrash = useCallback(async (id) => {
    const res = await dispatch(trashNote(id));
    if (trashNote.fulfilled.match(res)) {
      toast.success(res.payload.message ?? 'Moved to trash');
      loadStats();
    } else toast.error(res.payload ?? 'Failed');
    return res;
  }, [dispatch, loadStats]);

  const restoreNote = useCallback(async (id) => {
    const res = await dispatch(trashNote(id));
    if (trashNote.fulfilled.match(res)) {
      toast.success('Note restored');
      loadStats();
    }
    return res;
  }, [dispatch, loadStats]);

  const permanentDelete = useCallback(async (id) => {
    const res = await dispatch(deleteNote(id));
    if (deleteNote.fulfilled.match(res)) toast.success('Note deleted');
    else toast.error(res.payload ?? 'Failed');
    return res;
  }, [dispatch]);

  const clearTrash = useCallback(async () => {
    const res = await dispatch(emptyTrash());
    if (emptyTrash.fulfilled.match(res)) {
      toast.success(res.payload.message ?? 'Trash emptied');
      loadStats();
    }
    return res;
  }, [dispatch, loadStats]);

  const bulkAction = useCallback(async (ids, update) => {
    const res = await dispatch(bulkUpdate({ ids, update }));
    if (bulkUpdate.fulfilled.match(res)) {
      toast.success(`${res.payload.modifiedCount} notes updated`);
      loadNotes();
      loadStats();
      dispatch(clearSelected());
    }
    return res;
  }, [dispatch, loadNotes, loadStats]);

  /* ── ui actions ──────────────────────────────────────────────── */
  const openNote    = useCallback((note) => dispatch(setActiveNote(note)), [dispatch]);
  const closeNote   = useCallback(()     => dispatch(setActiveNote(null)), [dispatch]);
  const changeView  = useCallback((v)    => dispatch(setView(v)),          [dispatch]);
  const applyFilter = useCallback((f)    => dispatch(setFilters(f)),        [dispatch]);
  const clearFilter = useCallback(()     => dispatch(resetFilters()),        [dispatch]);
  const selectNote  = useCallback((id)   => dispatch(toggleSelected(id)),   [dispatch]);
  const deselectAll = useCallback(()     => dispatch(clearSelected()),       [dispatch]);

  /* ── derived ─────────────────────────────────────────────────── */
  const pinned  = state.items.filter((n) =>  n.isPinned && !state.filters.isArchived && !state.filters.isTrashed);
  const regular = state.items.filter((n) => !n.isPinned || state.filters.isArchived  ||  state.filters.isTrashed);

  return {
    ...state,
    pinned,
    regular,
    loadNotes,
    loadStats,
    addNote,
    saveNote,
    moveToTrash,
    restoreNote,
    permanentDelete,
    clearTrash,
    bulkAction,
    openNote,
    closeNote,
    changeView,
    applyFilter,
    clearFilter,
    selectNote,
    deselectAll,
  };
};