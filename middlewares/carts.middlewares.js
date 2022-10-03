//models
const { Cart } = require("../models/carts.model");
const { Product } = require("../models/products.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const cartExist = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { status: "active", userId: sessionUser.id },
  });

  if (!cart) {
    cart = Cart.create({ userId: sessionUser.id });
  }

  req.cart = cart;
  next();
});

const ProductExcess = catchAsync(async (req, res, next) => {
  const { quantity, productId } = req.body;

  const product = await Product.findOne({ where: { id: productId } });

   if(quantity > product.quantity) {
     return next(new AppError(''))
   }
});

module.exports = {
  cartExist,
  ProductExcess,
};
