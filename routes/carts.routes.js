const express = require("express");

//controllers


//middlewares
const {
    protectSession,
  } = require("../middlewares/auth.middlewares");
const { cartExist, ProductExcess } = require("../middlewares/carts.middlewares")


const cartsRouter = express.Router();

cartsRouter.post('/add-product', protectSession, cartExist, ProductExcess )



module.exports = {
    cartsRouter,
}