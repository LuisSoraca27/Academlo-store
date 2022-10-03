// models
const { Product } = require("../models/products.model");
const { Categories } = require("../models/categories.model")
const { User } = require("../models/user.model");
const { ProductImg } = require("../models/productImgs.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");

const {
  getProductsImgsUrls,
  uploadProductImgs,
} = require("../utils/fireBase.util");



const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, categoryId, quantity } = req.body;

  const { sessionUser } = req;

  const newProduct = await Product.create({
    title,
    description,
    quantity,
    price,
    categoryId,
    userId: sessionUser.id,
  });

  await uploadProductImgs(req.files, newProduct.id);

  res.status(201).json({
    status: "success",
    data: { newProduct },
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {

  const products = await Product.findAll({
    where: { status: "active" },
    attributes: ["id", "title", "description", "createdAt"],
    include: [
      { model: User, attributes: ["id", "username"] },
      { model: Categories,},
      {
        model: ProductImg, attributes: ["id", "imgUrl", "productId", "createdAt"]
      },
    ],
    });

     await getProductsImgsUrls(products)

  res.status(200).json({
    status: "success",
    data: { products },
  });
});

const getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { id, status: "active" },
    attributes: ["id", "title", "description", "createdAt"],
    include: [
      { model: User, attributes: ["id", "username"] },
      {
        model: ProductImg, attributes: ["id", "imgUrl", "productId", "createdAt"]
      },
    ],
  });

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  const { title, description, price, quantity } = req.body;

  await product.update({
    title,
    description,
    price,
    quantity,
  });

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: "disabled" });

  res.status(200).json({
    status: "success",
  });
});

const getAllCategories = catchAsync(async (req, res, next) => {

  const categories = Categories.findAll({ where: { status: "active" } });

  res.status(200).json({
    status: "success",
    data: { categories },
  });
});

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const category = await Categories.create({ name });

  res.status(201).json({
    status: "success",
    data: { category },
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { category } = req;

  const { name } = req.body;

  await category.update({
    name,
  });

  res.status(200).json({
    status: "success",
    data: { category },
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createCategory,
  updateCategory,
};
