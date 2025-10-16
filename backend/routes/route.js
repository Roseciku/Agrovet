const express = require('express');
const router = express.Router();

const { 
  getProducts, 
  addProduct, 
  updateProduct, 
  upload,
  deleteProduct 
} = require('../controllers/productController');

const { 
  registerUser, 
  loginUser, 
  refreshToken, 
  logoutUser 
} = require('../controllers/userController');

const { 
  addToCart, 
  getCart, 
  getProduct, 
  updateCart, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');

const { verifyUser } = require("../middleware/verifyUser");


//Product Routes

router.get('/allproducts', getProducts);                   // Get all products
router.post('/allproducts', verifyUser, upload, addProduct);       // Add new product
router.put('/allproducts/:id', verifyUser, upload, updateProduct); // Update product
router.delete('/allproducts/:id', verifyUser, deleteProduct); // Delete product


//User Auth Routes

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh', refreshToken);
router.post('/logout', logoutUser);


//Cart Routes

router.post("/add", verifyUser, addToCart);
router.get("/cart/:user_id", getCart);
router.get("/product/:product_id", getProduct);
router.put("/update", updateCart);
router.delete("/remove/:cart_id", removeFromCart);
router.delete("/clear/:user_id", clearCart);

module.exports = router;
