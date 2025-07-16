import { CartContext } from "../apiRequests/CartProvider";
import { ShoppingCart } from "lucide-react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../apiRequests/AuthProvider";


const CartPage = () => {
  const { cart, removeFromCart, loading } = useContext(CartContext);
  const { user } = useContext(AuthContext); // Get current user

// If not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center font-poppins text-center p-6">
        <p className="text-xl font-semibold mb-4 text-red-500">You need to log in to view your cart.</p>
        <NavLink
          to="/login"
          className="bg-farmGreen text-white px-4 py-2 rounded-full hover:bg-brightGreen"
        >
          Go to Login
        </NavLink>
      </div>
    );
  }

  // If cart is loading

  if (loading) return <p>Loading cart...</p>;

  const subtotal = cart.reduce(
    (acc, item) => acc + item?.price * item?.quantity,
    0
  );
  const shippingFee = 5.0;
  const tax = subtotal * 0.1;
  const orderTotal = subtotal + shippingFee + tax;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <ShoppingCart size={80} className="text-farmGreen mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">
          You haven’t added any items yet.
        </p>
        <NavLink to="/products">
          <button className="bg-farmGreen text-white px-6 py-3 rounded-full font-semibold hover:bg-brightYellow transition">
            Shop Now
          </button>
        </NavLink>
      </div>
    );
  } 
  return (
    <div className="w-full p-6">
      <h2 className="text-3xl font-bold text-center">Shopping Cart</h2>
      <div className="w-full px-4">
        <div>
          {cart.map((item) => (
            <div
              key={item?.cart_id}
              className="flex flex-col sm:flex-col md:flex-row lg:flex-row justify-between items-center border p-4 w-full"
            >
              <div>
                <img
                  src={`http://localhost:5500${item?.image}`}
                  alt={item?.name}
                  className="h-20 w-20 mb-2"
                />
                <p>{item?.name}</p>
              </div>
              <div>
                <p>Qty: {item?.quantity}</p>
                <button
                  onClick={() => removeFromCart(item?.cart_id)}
                  className="bg-red-500 text-white px-2"
                >
                  Remove
                </button>
              </div>
              <div>Ksh{(item?.price * item?.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-end p-6">
        <div>
          <h3 className="font-bold">Subtotal: Ksh{subtotal.toFixed(2)}</h3>
          <h3 className="font-bold">Shipping: Ksh{shippingFee}</h3>
          <h3 className="font-bold">Tax: Ksh{tax.toFixed(2)}</h3>
          <h3 className="font-bold text-xl">
            Total: Ksh{orderTotal.toFixed(2)}
          </h3>

         <NavLink to="/checkout"> <button className="bg-green-500 hover:bg-brightYellow text-white px-4 py-2 rounded-full font-poppins w-[150px]">
            Checkout
          </button> </NavLink>
        </div>
        <NavLink to="/products" className="text-farmGreen underline hover:text-brightYellow">Continue Shopping</NavLink>
      </div>
    </div>
  );
};

export default CartPage;
