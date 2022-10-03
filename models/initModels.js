// Models
const { Cart } = require("./carts.model");
const { Categories } = require("./categories.model");
const { Order } = require("./order.model");
const { ProductImg } = require("./productImgs.model");
const { Product } = require("./products.model");
const { ProductsInCart } = require("./productsInCart.model");
const { User } = require("./user.model");

const initModels = () => {
  // 1 User <----> M Product
  User.hasMany(Product, { foreignKey: "userId" });
  Product.belongsTo(User);

  // 1 User <----> M Order
  User.hasMany(Order, { foreignKey: "userId" });
  Order.belongsTo(User);

  // 1 User <-----> 1 Cart
  User.hasOne(Cart, { foreignKey: "userId" });
  Cart.belongsTo(User);

  // 1 Cart <-----> 1 Order
  Cart.hasOne(Order, { foreignKey: "cartId" });
  Order.belongsTo(Cart);

  // 1 Cart <----> M ProductInCart
  Cart.hasMany(ProductsInCart, { foreignKey: "cartId" });
  ProductsInCart.belongsTo(Cart);

  // 1 Categories <-----> 1 Product
  Categories.hasOne(Product, { foreignKey: "categoryId" });
  Product.belongsTo(Categories);


  // 1 Product <----> M ProductImgs
  Product.hasMany(ProductImg, { foreignKey: "productId" });
  ProductImg.belongsTo(Product);

  // 1 Product <----> M ProductImgs
  Product.hasOne(ProductsInCart, { foreignKey: "productId" });
  ProductsInCart.belongsTo(Product);

};

module.exports = { initModels };
