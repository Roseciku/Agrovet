const supabase = require('../config/supabaseClient');
const jwt = require("jsonwebtoken");

// ADD ITEM TO CART
exports.addToCart = async (req, res) => {
  const user_id = req.user.user_id; // verified from token middleware
  const { product_id, quantity } = req.body;

  try {
    // Check if item already exists
    const { data: existingItem, error: existingError } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user_id)
      .eq("product_id", product_id);

    if (existingError) {
      console.error("Error checking existing cart item:", existingError);
      return res.status(500).json({
        message: "Error checking existing cart item",
        error: existingError.message,
      });
    }

    if (existingItem && existingItem.length > 0) {
      // Update quantity
      const newQuantity = existingItem[0].quantity + quantity;

      const { error: updateError } = await supabase
        .from("cart")
        .update({ quantity: newQuantity })
        .eq("user_id", user_id)
        .eq("product_id", product_id);

      if (updateError) {
        console.error("Error updating cart item:", updateError);
        return res.status(500).json({
          message: "Error updating cart quantity",
          error: updateError.message,
        });
      }
    } else {
      // Insert new item
      const { error: insertError } = await supabase
        .from("cart")
        .insert([{ user_id, product_id, quantity }]);

      if (insertError) {
        console.error("Error inserting new cart item:", insertError);
        return res.status(500).json({
          message: "Error adding product to cart",
          error: insertError.message,
        });
      }
    }

    // Fetch updated cart
    const { data: updatedCart, error: fetchError } = await supabase
      .from("cart")
      .select(`
  cart_id,
  quantity,
  products ( name, price, image )
`)
      .eq("user_id", user_id);

    if (fetchError) {
      console.error("Error fetching updated cart:", fetchError);
      return res.status(500).json({
        message: "Error fetching updated cart",
        error: fetchError.message,
      });
    }

    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    console.error("Error in addToCart:", error.message);
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// GET CART ITEMS FOR A USER
exports.getCart = async (req, res) => {
  const { user_id } = req.params;

  try {
    const { data: cartItems, error } = await supabase
      .from("cart")
      .select(
        `
        cart_id,
        quantity,
        products(name, price, image)
      `
      )
      .eq("user_id", user_id);

    if (error) {
      console.error("Error fetching cart:", error);
      return res.status(500).json({
        message: "Error fetching cart",
        error: error.message,
      });
    }

    console.log("Cart items fetched from DB:", cartItems);
    res.status(200).json({ cart: cartItems });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

// GET A SINGLE PRODUCT BY ID
exports.getProduct = async (req, res) => {
  const { product_id } = req.params;

  try {
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("product_id", product_id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({
        message: "Error fetching product",
        error: error.message,
      });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// UPDATE QUANTITY IN CART
exports.updateCart = async (req, res) => {
  const { cart_id, quantity } = req.body;

  try {
    const { error: updateError } = await supabase
      .from("cart")
      .update({ quantity })
      .eq("cart_id", cart_id);

    if (updateError) {
      console.error("Error updating cart:", updateError);
      return res.status(500).json({
        message: "Error updating cart",
        error: updateError.message,
      });
    }

    // Get user_id for the updated cart item
    const { data: userData, error: userError } = await supabase
      .from("cart")
      .select("user_id")
      .eq("cart_id", cart_id)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user after update:", userError);
      return res.status(404).json({ message: "User not found for this cart" });
    }

    const user_id = userData.user_id;

    // Fetch updated cart
    const { data: updatedCart, error: fetchError } = await supabase
      .from("cart")
      .select(
        `
        cart_id,
        quantity,
        products(name, price, image)
      `
      )
      .eq("user_id", user_id);

    if (fetchError) {
      console.error("Error fetching updated cart:", fetchError);
      return res.status(500).json({
        message: "Error fetching updated cart",
        error: fetchError.message,
      });
    }

    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
};

// REMOVE ITEM FROM CART
exports.removeFromCart = async (req, res) => {
  const { cart_id } = req.params;

  try {
    // Get user_id for that cart item
    const { data: userData, error: userError } = await supabase
      .from("cart")
      .select("user_id")
      .eq("cart_id", cart_id)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ message: "User/cart not found" });
    }

    const user_id = userData.user_id;

    // Delete cart item
    const { error: deleteError } = await supabase
      .from("cart")
      .delete()
      .eq("cart_id", cart_id);

    if (deleteError) {
      console.error("Error deleting cart item:", deleteError);
      return res.status(500).json({
        message: "Error removing item from cart",
        error: deleteError.message,
      });
    }

    // Fetch updated cart
    const { data: updatedCart, error: fetchError } = await supabase
      .from("cart")
      .select(
        `
        cart_id,
        quantity,
        products(name, price, image)
      `
      )
      .eq("user_id", user_id);

    if (fetchError) {
      console.error("Error fetching updated cart:", fetchError);
      return res.status(500).json({
        message: "Error fetching updated cart",
        error: fetchError.message,
      });
    }

    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
};

// CLEAR ENTIRE CART
exports.clearCart = async (req, res) => {
  const { user_id } = req.params;

  try {
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", user_id);

    if (error) {
      console.error("Error clearing cart:", error);
      return res.status(500).json({
        message: "Error clearing cart",
        error: error.message,
      });
    }

    res.status(200).json({ cart: [] });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};
