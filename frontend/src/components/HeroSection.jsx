import { NavLink } from "react-router-dom";


function HeroSection() {
  return (
    <div className="relative h-[80vh] flex items-center justify-center bg-hero bg-cover bg-center">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Text Content (On Top of Overlay) */}
      <div className="relative text-center text-white">
        <h1 className="font-poppins text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold mb-6 break-words text-center px-4">
          Farming Made Easy, Growth Made Possible!
        </h1>
        <p className="font-poppins text-lg sm:text-2xl md:text-2xl lg:text-3xl font-semibold leading-relaxed break-words text-center px-4">
          From fertilizers, animal feeds to farm tools, <br /> get everything
          you need to boost productivity and maximize.
        </p>
         <button className=" flex mx-auto mt-[100px] justify-center items-center text-center font-poppins cursor-pointer px-5 bg-brightYellow w-[300px] h-[40px] text-white text-lg rounded-2xl">
        <NavLink to= "/products">Shop Now</NavLink>
      </button>
      </div>
    </div>
  );
}

export default HeroSection;
