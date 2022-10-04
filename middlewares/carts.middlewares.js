//models
const { Cart } = require("../models/carts.model");
const { Product } = require("../models/products.model");
const { ProductsInCart } = require("../models/productsInCart.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");




const searchOrCreateCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { status: "active", userId: sessionUser.id },
  });

  if (!cart) {
    cart = await Cart.create({ userId: sessionUser.id });
  }

  req.cart = cart;
  next();
});



const cartExist = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { status: "active", userId: sessionUser.id },
  });

  if (!cart) {
    return new AppError("Cart not found", 404);
  }

  req.cart = cart;
  next();
});



const ProductExcess = catchAsync(async (req, res, next) => {
  const { quantity, productId } = req.body;

  const product = await Product.findOne({
    where: { id: productId, status: "active" },
  });

  if (quantity > product.quantity) {
    return next(
      new AppError("The requested quantity exceeds the existing quantity", 400)
    );
  }
  next();
});



const productExistInCart = catchAsync(async (req, res, next) => {
  const { quantity, productId } = req.body;

  const product = await Product.findOne({ where: { id: productId } });

  const productInCart = await ProductsInCart.findOne({
    where: { productId: product.id, status: "active" },
  });

  if (productInCart) {
    return next(new AppError("Product exist in cart", 400));
  }

  productInCart = await ProductsInCart.findOne({
    where: { productId: product.id, status: "removed" },
  });

  if (productInCart) {
    await productInCart.update({
      status: "active",
      quantity,
    });
  }

  next();
});



const updateStatusProduct = catchAsync(async (req, res, next) => {
  const { quantity, productId } = req.body;

  const productInCart = await ProductsInCart.findOne({
    where: { productId },
  });

  if ( quantity === 0 && productInCart.status === "active") {
    productInCart.update({ status: "removed" });
  }

  if ( quantity !== 0 && productInCart.status === "removed") {
    productInCart.update({ status: "active" });
  }

  req.productInCart = productInCart;
  next();
});



module.exports = {
  cartExist,
  searchOrCreateCart,
  ProductExcess,
  productExistInCart,
  updateStatusProduct,
};
