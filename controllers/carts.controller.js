//models
const { ProductsInCart } = require("../models/productsInCart.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");

const addProductInCart = catchAsync(async (req, res, next) => {
  const { cart } = req;
  const { productId, quantity } = req.body;

  const newProductInCart = await ProductsInCart.create({
    cartId: cart.id,
    productId,
    quantity,
  })
  res.status(201).json({
    status: 'success',
    data: {newProductInCart}
  })

});

const updateProductInCart = catchAsync( async (req, res, next) => {

    const { ProductsInCart } = req
    const { quantity } = req.body

    ProductsInCart.update({ quantity })
}) 


module.exports = {
    addProductInCart,
    updateProductInCart,
}