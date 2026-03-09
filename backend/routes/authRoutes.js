const { Router } = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

module.exports = router;
