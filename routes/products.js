const express = require("express");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
} = require("../controllers/products");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/", getProducts);
router.get("/:productId", getProductDetail);
router.use(authenticate);
router.route("/").post(createProduct);
router.route("/:productId").patch(updateProduct).delete(deleteProduct);

module.exports = router;
