import api from "./axiosInstance";

export const notesApi = {
  /** Get all notes with optional filters */
  getAll: (params) => api.get("/notes", { params }),
  /** Get stats */
  getStats: () => api.get("/notes/stats"),
  /** Get note by id */
  getById: (id) => api.get(`/notes/${id}`),
  /** Create note */
  create: (data) => api.post("/notes", data),
  /** Update note */
  update: (id, data) => api.put(`/notes/${id}`, data),
  /** Toggle trash */
  toggleTrash: (id) => api.patch(`/notes/${id}/trash`),
  /** Delete note */
  delete: (id) => api.delete(`/notes/${id}`),
  /** Empty trash */
  emptyTrash: () => api.delete("/notes/trash"),
  /** Bulk update */
  bulkUpdate: (ids, update) => api.patch("/notes/bulk", { ids, update }),
};
