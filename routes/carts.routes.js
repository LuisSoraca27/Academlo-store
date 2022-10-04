const express = require("express");

//controllers
const { addProductInCart, updateProductInCart } = require("../controllers/carts.controller");

//middlewares
const { protectSession } = require("../middlewares/auth.middlewares");

const {
  cartExist,
  ProductExcess,
  productExistInCart,
  searchOrCreateCart,
  updateStatusProduct,
} = require("../middlewares/carts.middlewares");

const cartsRouter = express.Router();

cartsRouter.use(protectSession);

cartsRouter.post(
  "/add-product",
  searchOrCreateCart,
  ProductExcess,
  productExistInCart,
  addProductInCart
);

cartsRouter.patch(
  "/update-cart",
  cartExist,
  ProductExcess,
  updateStatusProduct,
  updateProductInCart,
);

module.exports = {
  cartsRouter,
};
