const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
  BadRequestError,
  NotFoundError,
  UnAuthonticatedError,
} = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body }); //todo treat the internal server error comming from here later
  const token = user.createToken();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    throw new BadRequestError("please provide an email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnAuthonticatedError("invalid email");
  }
  const truePassword = user.cmparePassword(password);
  if (!truePassword) {
    throw new UnAuthonticatedError("invalid password");
  }
  const token = user.createToken();
  res.status(StatusCodes.OK).json({
    user: { name: user.name },
    token,
  });
};

module.exports = { register, login };
