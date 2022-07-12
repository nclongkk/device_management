const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../constants/constants");
const { User, Category, Product } = require("../models");
const { Op, and, or, where } = require("sequelize");

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

exports.getProducts = async (req, res) => {
  try {
    let findingQuery;
    if (req.query.categoryId) {
      findingQuery = {
        ...findingQuery,
        categoryId: Number(req.query.categoryId),
      };
    }

    if (req.query.keyword) {
      findingQuery = {
        ...findingQuery,
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${req.query.keyword}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${req.query.keyword}%`,
            },
          },
        ],
      };
    }

    const products = await Product.findAll({
      where: findingQuery,
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });
    return res.status(httpStatus.OK).json({ success: true, products });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });
    return res.status(httpStatus.OK).json({ success: true, product });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: req.body.image,
      soldQuantity: req.body.soldQuantity,
      categoryId: req.body.categoryId,
    });
    return res.status(httpStatus.CREATED).json({ success: true, product });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const product = await Product.update(
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        image: req.body.image,
        soldQuantity: req.body.soldQuantity,
        categoryId: req.body.categoryId,
      },
      {
        where: { id: req.params.productId },
      }
    );
    return res.status(httpStatus.OK).json({ success: true, product });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await verifyAdmin(req, res);
    const product = await Product.destroy({
      where: { id: req.params.productId },
    });
    return res.status(httpStatus.OK).json({ success: true, product });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};
