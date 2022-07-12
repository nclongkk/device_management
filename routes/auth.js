const express = require("express");
const { register, login, getMe } = require("../controllers/auth");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(authenticate);
router.get("/me", getMe);

module.exports = router;
