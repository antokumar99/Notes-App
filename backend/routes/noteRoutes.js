const { Router } = require("express");
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  toggleTrash,
  getStats,
  emptyTrash,
  bulkUpdate,
} = require("../controllers/notesController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = Router();

// All notes routes require auth
router.use(protect);

router.route("/").get(getNotes).post(createNote);

router.get("/stats", getStats);
router.delete("/trash/empty", emptyTrash);
router.put("/bulk", bulkUpdate);

router.route("/:id").get(getNoteById).put(updateNote).delete(deleteNote);

router.put("/:id/trash", toggleTrash);

module.exports = router;
