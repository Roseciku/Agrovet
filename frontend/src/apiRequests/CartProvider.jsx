import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

const apiUrl = import.meta.env.VITE_API_URL;
// Create CartContext
export const CartContext = createContext();

// Create the CartProvider component
const CartProvider = ({ children }) => {
  // wraps other component(its children and provides them with cart related logic)
  const { user, accessToken } = useContext(AuthContext); //grabs the currently logged-in user and their access token from AuthContext
  const navigate = useNavigate(); // Initializes navigate so that one is able to redirect users
  const [cart, setCart] = useState([]); //sets up cart as state. This is where you store the current items in the cart
  const [loading, setLoading] = useState(true); // Adds a loading state to track whether the cart is still being fetched from the server
 console.log({user})
 
  // Fetch cart data from backend when the component mounts
  useEffect(() => {
    
    if (!user || !user.user_id) return;

    const fetchCart = async () =>  {
      try {
        const response = await fetch(
          `${apiUrl}/api/cart/${user.user_id}`
        );
        const data = await response.json();
      setCart(data.cart);
        console.log("Fetched cart:", data.cart);

        // Check for productToAdd
      const productToAdd = localStorage.getItem("productToAdd");
      if (productToAdd) {
        const parsedProduct = JSON.parse(productToAdd);
        console.log("Auto-adding product after login:", parsedProduct);
        await addToCart(parsedProduct);
        localStorage.removeItem("productToAdd");
      }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCart([]); // Prevent loading loop
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]); 

  // Add item to cart
  const addToCart = async (product) => {
    
    if (!product || !product.product_id) {
      console.error("Invalid product:", product);
      return;
    }
 console.log({user})

    if (!user) {
      // Save the current URL and product to localStorage
  localStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search);
  localStorage.setItem("productToAdd", JSON.stringify(product));

  navigate("/login");
  return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          product_id: product.product_id,
          quantity: 1,
        }),
        credentials: "include",
      });
      
      const data = await response.json();
      console.log("Cart after add response:", data.cart);
      // setCart((prevCart) => [...(prevCart || []), data.cart]);
      setCart(data.cart); // Update cart with the new data from the backend
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };
// Update item quantity in cart
const updateQuantity = async (cart_id, quantity) => {
  try {
    const response = await fetch(`${apiUrl}/api/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart_id, quantity }),
    });
    const data = await response.json();
    //setCart((prevCart) => [...(prevCart || []), data.cart]);
     setCart(data.cart); // Update cart after quantity change
  } catch (error) {
    console.error("Failed to update quantity:", error);
  }
};

 // Remove item from cart
  const removeFromCart = async (cart_id) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/remove/${cart_id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      setCart(data.cart); // Update cart after removing item
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }

  };

  const subtotal = cart.reduce(
  (acc, item) => acc + Number(item?.products?.price) * Number(item?.quantity),
  0
);
const shippingFee = 5.0;
const tax = subtotal * 0.1;
const orderTotal = subtotal + shippingFee + tax;

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, loading, subtotal, shippingFee, tax, orderTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
