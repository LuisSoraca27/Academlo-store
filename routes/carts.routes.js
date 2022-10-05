const express = require("express");

//controllers
const {
  addProductInCart,
  updateProductInCart,
  deleteProductInCart,
} = require("../controllers/carts.controller");
const { purchase } = require("../controllers/orders.controller")

//middlewares
const { protectSession } = require("../middlewares/auth.middlewares");

const {
  cartExist,
  excessQtyProduct,
} = require("../middlewares/carts.middlewares");

const cartsRouter = express.Router();

cartsRouter.use(protectSession);

cartsRouter.post("/add-product", excessQtyProduct, addProductInCart);

cartsRouter.patch(
  "/update-cart",
  cartExist,
  excessQtyProduct,
  updateProductInCart
);

cartsRouter.delete("/:productId", cartExist, deleteProductInCart);

cartsRouter.post('/purchase', purchase)

module.exports = {
  cartsRouter,
};
