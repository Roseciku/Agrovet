import React from "react";
import Vegetables from "../assets/images/Vegetables.jpg";
import ProductSection from "./ProductSection";


function MainPage({linksRef, isActive}) {
  return (
    <div 
    ref={linksRef} 
    className={`mt-6 font-poppins transition-colors duration-500 ${
    isActive ? "bg-gray-400 border-2 border-gray-900" : "bg-white"
  }`}>
      <div className="flex flex-col lg:flex-row items-center gap-8 max-w-6xl mx-auto ">
        <div className="w-full lg:w-1/2 h-[400px]">
          <img
            className="w-full h-full object-cover rounded-lg shadow-lg"
            src={Vegetables}
            alt=""
          />
        </div>
        <div className= "w-full px-5 lg:w-1/2">
          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-farmGreen mb-5 text-center">
            Who We Are
          </h1>
          <p className="text-gray-700 text-md sm:text-xl md:text-xl lg:text-xl leading-relaxed sm:px-4">
            At{" "}
            <span className="font-bold text-farmGreen">FarmMate Agrovet</span>,
            we are dedicated to providing{" "}
            <span className="font-semibold">
              high-quality farm inputs, and expert advice.
            </span>{" "}
            Our commitment is to provide farmers with the right tools,
            knowledge, and support to maximize productivity and achieve a
            bountiful harvest.
          </p>
          <p className="text-gray-700 text-md sm:text-xl md:text-xl lg:text-xl leading-relaxed mt-4">
            With a deep understanding of the agricultural industry, we offer a
            wide range of farm essentials, including premium{" "}
            <span className="font-bold">
              fertilizers, high-quality seeds, effective pesticides, animal
              feeds, and essential farm tools.
            </span>
            Whether you are a small-scale farmer or managing large agricultural
            projects, we are here to support your journey toward sustainable
            growth.
          </p>
        </div>
      </div>
      <ProductSection />
      
    </div>
  );
}

export default MainPage;
