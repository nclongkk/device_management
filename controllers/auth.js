const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../constants/constants");
const { User, sequelize } = require("../models");

const getSignedJwtToken = (id) => {
  return jwt.sign({ id }, "18pfiev2");
};

exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: ROLES.USER,
    });
    const token = getSignedJwtToken(user.id);
    const options = {
      httpOnly: true,
    };
    return res.status(httpStatus.CREATED).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ success: false, error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Dont't have an account",
      });
    }
    if (password !== user.password) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const token = getSignedJwtToken(user.id);
    const options = {
      httpOnly: true,
    };
    return res.status(httpStatus.OK).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ success: false, error });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });
    return res.status(httpStatus.OK).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({ success: false, error });
  }
};
