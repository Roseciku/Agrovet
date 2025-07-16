import {useForm} from 'react-hook-form'
import {NavLink, useNavigate } from "react-router-dom";
function SignUpPage() {

const{register, handleSubmit, formState:{errors},} = useForm();
const navigate = useNavigate

const onSubmit = async(data) =>{
  try {
    const response = await fetch("http://localhost:5500/api/register",{
      method: "POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    const result = await response.json();

    if(response.ok){
      alert("Registration successful!");
      navigate("/login");
    }else{
      alert("Registration failed: " + result.message)
    }

    reset()
  } catch (error) {

    console.error("Error during registration:", error);
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-farmGreen ">
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
    <form onSubmit ={handleSubmit(onSubmit)}className='font-poppins'>
        <h2 className='text-3xl text-center font-semibold mb-6'>Sign Up</h2>
    <div className='mb-4'>
      <label htmlFor="name" className='block text-gray-700 font-bold mb-2'>Username</label>
      <input
       type="text" 
       {...register("name", { required: "Name is required"})} 
       placeholder='Enter your full names'
        className='border rounded w-full py-2 px-3 mb-2' 
        />
        {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
    </div>

    <div className='mb-4' >
      <label htmlFor="email" className='block text-gray-700 font-bold mb-2'>Email</label>
      <input 
      type='text'
    {...register("email", {
        required: "Email is required",
        pattern:{
            value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email format"
        }
    })}
      placeholder='example@gmail'
       className='border rounded w-full py-2 px-3 mb-2'
       />
       {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
      </div>

      <div className='mb-4'>
      <label htmlFor="password" className='block text-gray-700 font-bold mb-2'>Password</label>
      <input 
      type="password" 
      {...register("password",{
        required: "Password is required",
        minLength:{value:6, message:"Password must be atleast 6 characters"},
      })}
      className='border rounded w-full py-2 px-3 mb-2'
      />
      {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
      </div>

      <button
            type="submit"
            className="w-full text-xl font-bold bg-brightYellow text-white p-3 rounded-lg hover:bg-brightOrange transition"
          >
            Sign Up
          </button>
      </form>
      <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account? <NavLink to="/login" className="text-blue-500 hover:underline">Log in</NavLink>
        </p>
    </div>
    </div>
  )
}

export default SignUpPage
