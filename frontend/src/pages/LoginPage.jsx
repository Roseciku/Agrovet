import {useForm} from 'react-hook-form'
import { AuthContext } from '../apiRequests/AuthProvider';
import { CartContext } from '../apiRequests/CartProvider';

import { useContext } from 'react';
import { useLocation, useNavigate, NavLink } from "react-router-dom";

function LoginPage() {

const{register, handleSubmit, formState:{errors},} = useForm();
const {login} = useContext(AuthContext);
const location = useLocation();
const navigate = useNavigate();
const { addToCart } = useContext(CartContext);

const onSubmit = async(data) => {
    try {
     const user = await login(data.email, data.password);

      if (user) {
      const savedRedirect = localStorage.getItem("redirectAfterLogin");
      const productToAdd = localStorage.getItem("productToAdd");

      if (productToAdd) {
        navigate(savedRedirect || "/products");
      }

     else {
        navigate("/products");
      }
    }
  } catch (error) {
    console.error("Login failed:", error.message);
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-farmGreen ">
    <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm md:max-w-lg'>
      <form onSubmit={handleSubmit(onSubmit)} className='font-poppins'> 
        <h2 className='text-3xl text-center font-semibold mb-6'>Log In</h2>
        <div className='mb-4'>
            <label htmlFor="email" className='block text-gray-700 font-bold mb-2'>Email</label>
            <input
             type="text"
            {...register("email",{required:"Email is required" })}
             className='border rounded w-full py-2 px-3 mb-2'  
             />
             {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
        </div>
        <div className='mb-4'>
            <label htmlFor="password" className='block text-gray-700 font-bold mb-2'>Password</label>
            <input 
            type="password"
            {...register("password",{required:"Password is required" })}
            className='border rounded w-full py-2 px-3 mb-2' 
            />
            {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
        </div>
        <button
        type='submit'
        className="w-full text-xl font-bold bg-brightYellow text-white p-3 rounded-lg hover:bg-brightOrange transition"
        >
            Login
            
            </button>
      </form>
      <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account? <NavLink to="/signup" className="text-blue-500 hover:underline">Sign Up</NavLink>
        </p>
    </div>
    </div> 
  )
}

export default LoginPage

/*
What was there before onsubmit:

const user = await login(data.email, data.password);

      const queryParams = new URLSearchParams(location.search);
      const redirect = queryParams.get("redirect");
      const product_id = queryParams.get("product_id");


      if (redirect === "add-to-cart" && product_id && user) {
       
         navigate(`/products?redirect=${redirect}&productId=${product_id}`); // go back to products page
      } else {
        
        navigate("/products"); // default after login
      }

    } 




*/