const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { User } = require("../models/user.model");
const { Product } = require("../models/products.model");
const { Order } = require("../models/order.model");
const { Cart } = require("../models/carts.model");
const { ProductsInCart } = require("../models/productsInCart.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const getProductsUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const products = await Product.findAll({
    where: { userId: sessionUser.id, status: "active" },
  });

  if (!products) {
    return next(new AppError("this user has no products", 404));
  }

  res.status(200).json({
    status: "success",
    data: { products },
  });
});

const getOrdersUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    where: { userId: sessionUser.id, status: "active" },
    include: {
      model: Cart,
      attributes: ["id", "userId", "status"],
      include: {
        model: ProductsInCart,
        attributes: ["id", "productId", "quantity", "status"],
        include: { model: Product, attributes: ["id", "title"] },
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: { orders },
  });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const order = await Order.findOne({
    where: { userId: sessionUser.id, id },
    include: {
      model: Cart,
      attributes: ["id", "userId", "status"],
      include: {
        model: ProductsInCart,
        attributes: ["id", "productId", "quantity", "status"],
        include: { model: Product, attributes: ["id", "title"] },
      },
    },
  });

  if (!order) {
    return next(new AppError("this order not exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: { order },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  // Encrypt the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  newUser.password = undefined;

  res.status(201).json({
    status: "success",
    data: { newUser },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;
  const { user } = req;

  await user.update({ username, email });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: "deleted" });

  res.status(200).json({ status: "success" });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: "active" },
  });

  // Compare passwords (entered password vs db password)
  // If user doesn't exists or passwords doesn't match, send error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Wrong credentials", 400));
  }

  // Remove password from response
  user.password = undefined;

  // Generate JWT (payload, secretOrPrivateKey, options)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    status: "success",
    data: { user, token },
  });
});

module.exports = {
  getProductsUser,
  getOrdersUser,
  getOrderById,
  createUser,
  updateUser,
  deleteUser,
  login,
};
