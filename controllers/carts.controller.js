//models
const { ProductsInCart } = require("../models/productsInCart.model");
const { Cart } = require("../models/carts.model")

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const addProductInCart = catchAsync(async (req, res, next) => {
  
    const { sessionUser } = req;
  const { productId, quantity } = req.body;


  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
  });

  if (!cart) {
    // Assign cart to user (create cart)
    const newCart = await Cart.create({ userId: sessionUser.id });

    await ProductsInCart.create({ cartId: newCart.id, productId, quantity });
  } else {
    // Cart already exists
    const productInCart = await ProductsInCart.findOne({
      where: { productId, cartId: cart.id },
    });

    if (!productInCart) {
      // Add product to current cart
      await ProductsInCart.create({ cartId: cart.id, productId, quantity });
    } else if (productInCart.status === 'active') {
      return next(
        new AppError('This product is already active in your cart', 400)
      );
    } else if (productInCart.status === 'removed') {
      await productInCart.update({ status: 'active', quantity });
    }
  }

  res.status(200).json({
    status: 'success',
  });

});

const updateProductInCart = catchAsync( async (req, res, next) => {
  const { quantity, productId } = req.body;
  const { cart } = req

  const productInCart = await ProductsInCart.findOne({
    where: { productId, cartId: cart.id },
  });

  if ( quantity === 0 && productInCart.status === "active") {
    productInCart.update({ status: "removed" });
  }else if ( quantity !== 0 && productInCart.status === "removed") {
    productInCart.update({ status: "active" });
  }

  await productInCart.update({ quantity })

  res.status(200).json({
    status: 'success'
  })

}) 

const deleteProductInCart = catchAsync(async (req,res,next) => {

  const { cart } = req
  const { productId } = req.params

  const productInCart = await ProductsInCart.findOne({
    where: { productId, cartId: cart.id, status: 'active' },
  });

  if(!productInCart) {
    return next(new AppError('This product is not in your cart'))
  }

  await productInCart.update({
    quantity: 0, status: 'removed'
  })

  res.status(200).json({
    status: 'success'
  })


})

module.exports = {
    addProductInCart,
    updateProductInCart,
    deleteProductInCart,
}