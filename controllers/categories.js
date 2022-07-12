const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../constants/constants");
const { User, Category } = require("../models");

const verifyAdmin = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    if (user.role !== "admin") {
      throw new Error("You are not admin");
    }
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.status(httpStatus.OK).json({ success: true, categories });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const category = await Category.create({
      name: req.body.name,
    });
    return res.status(httpStatus.CREATED).json({ success: true, category });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};
