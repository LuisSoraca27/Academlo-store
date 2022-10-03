const express = require("express");

//controllers
const {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getAllCategories,
  createCategory,
   updateCategory,
} = require("../controllers/products.controller");

// middlewares
const { productExists } = require('../middlewares/product.middlewares')
const { categoryExists } = require("../middlewares/categories.middlewares")
const {
  protectSession,
  protectProductOwner,
} = require("../middlewares/auth.middlewares");
const { createProductsValidators } = require("../middlewares/validators.middlewares")

//utils
const { upload } = require("../utils/multer.util")

const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);

productsRouter.get("/:id", getProductById);

productsRouter.get("/categories", getAllCategories)

// Protecting below endpoints
productsRouter.use(protectSession);

productsRouter.post("/", upload.array('productImg', 5),createProductsValidators, createProduct);

productsRouter.patch("/:id", productExists, protectProductOwner, updateProduct)

productsRouter.delete("/:id" ,productExists, protectProductOwner, deleteProduct)

productsRouter.post("/categories", createCategory)

productsRouter.patch("/cotegories/:id", categoryExists, updateCategory)



module.exports = {
  productsRouter
}