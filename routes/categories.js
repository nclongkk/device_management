const express = require("express");
const { getCategories, createCategory } = require("../controllers/categories");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/", getCategories);
router.use(authenticate);
router.route("/").post(createCategory);

module.exports = router;
