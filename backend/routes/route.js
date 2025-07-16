const express = require('express');
const router = express.Router();
const{products} = require('../controllers/productController')
const{registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/userController')
const{addToCart, getCart, getProduct, updateCart, removeFromCart, clearCart} = require('../controllers/cartController')
const { verifyUser } = require("../middleware/verifyUser");

router.get('/allproducts', products );
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh', refreshToken)
router.post('/logout', logoutUser);
router.post("/add", verifyUser, addToCart);
router.get("/cart/:user_id", getCart);
router.get("/product/:product_id", getProduct)
router.put("/update", updateCart);
router.delete("/remove/:cart_id", removeFromCart);
router.delete("/clear/:user_id", clearCart);

module.exports = router;