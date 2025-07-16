import { useForm } from "react-hook-form";
import { useContext } from "react";
import { CartContext } from "../apiRequests/CartProvider";
import { NavLink } from "react-router-dom";

function CheckOutPage() {
  const { orderTotal } = useContext(CartContext);
  const { register, handleSubmit } = useForm();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-farmGreen mb-6">Checkout</h2>

        {/* Back to Cart */}
        <div className="mb-6 text-right">
          <NavLink
            to="/cart"
            className="text-sm text-farmGreen hover:text-brightYellow font-semibold underline"
          >
            ← Back to Cart
          </NavLink>
        </div>

        {/* MPesa Button */}
        <button className="bg-farmGreen text-white px-8 py-3 rounded-xl w-full font-bold text-lg mb-4 hover:bg-brightYellow transition">
          Pay with MPesa
        </button>

        <p className="text-center text-sm text-gray-500 font-semibold mb-6">or fill card details below</p>

        <form className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold text-farmGreen mb-2">Contact Information</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-farmGreen"
            />
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-bold text-farmGreen mb-2">Payment Details</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              {...register("cardnumber", { required: "Card number is required" })}
              className="w-full border rounded-lg py-2 px-3"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="month"
                {...register("date", { required: "Expiry date is required" })}
                className="w-full border rounded-lg py-2 px-3"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <input
                type="number"
                {...register("cvc", { required: "CVC is required" })}
                className="w-full border rounded-lg py-2 px-3"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-bold text-farmGreen mb-2">Shipping Address</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Town / Address</label>
            <input
              type="text"
              {...register("address", { required: "Address is required" })}
              className="w-full border rounded-lg py-2 px-3"
            />
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            className="w-full bg-brightYellow text-white font-bold text-lg py-4 rounded-xl shadow hover:bg-yellow-500 transition"
          >
            Pay Ksh {orderTotal.toFixed(2)}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckOutPage;
