import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimalFeeds from "../assets/images/AnimalFeeds.jpg";
import VetServices from "../assets/images/VetServices.jpg";
import FarmEquipment from "../assets/images/FarmEquipment.jpg";
import ConsultationServices from "../assets/images/ConsultationServices.jpg";
import PetFeeds from "../assets/images/PetFeeds.jpg";
import Pesticides from "../assets/images/Pesticides.jpg";
import Fertilizer from "../assets/images/Fertilizer.jpg";

const products = [
  {
    image: Fertilizer,
    title: "Premium Fertilizer",
    description:
      "Boost your crop yield with our high-quality organic fertilizer.",
  },

  {
    image: AnimalFeeds,
    title: "Animal Feeds",
    description:
      "Ensure your livestock gets the best nutrition with our top-quality feeds.",
  },
  {
    image: FarmEquipment,
    title: "Farm Equipment",
    description:
      "High-quality tools and machinery to enhance farm productivity, from plows and sprayers to irrigation systems.",
  },
  {
    image: PetFeeds,
    title: "Pet Feeds",
    description:
      "Nutritionally balanced feeds tailored for pets, ensuring their health, growth, and energy needs are met.",
  },
  {
    image: Pesticides,
    title: "Pesticides",
    description:
      "Effective and safe solutions for pest control, protecting your crops and livestock from harmful infestations.",
  },
  {
    image: ConsultationServices,
    title: "Consultation Services",
    description:
      "Expert agricultural advice to help you maximize yields, improve soil health, and manage pests efficiently.",
  },
  {
    image: VetServices,
    title: " Vet Services",
    description:
      "Professional veterinary care to keep your livestock and pets healthy, including checkups, vaccinations, and disease management.",
  },
];

function ProductSection() {
  const [currentProduct, setCurrentProduct] = React.useState(0);
  const [direction, setDirection] = React.useState(1); // Controls slide direction (1 = next, -1 = previous)

  //Function to go to the next slide
  const nextSlide = () => {
    setDirection(1);
    setCurrentProduct(
      (prevProduct) =>
        prevProduct === products.length - 1 ? 0 : prevProduct + 1 //If prevIndex is the last slide (products.length - 1), it resets back to 0, ensuring the slider loops back to the first slide.Otherwise, it increases prevIndex by 1, moving to the next slide.
    );
  };
  // Function to go to the previous slide
  const prevSlide = () => {
    setDirection(-1);
    setCurrentProduct(
      (prevProduct) =>
        prevProduct === 0 ? products.length - 1 : prevProduct - 1 //If prevIndex is 0 (the first slide), it sets the index to products.length - 1, moving to the last slide (looping backward).Otherwise, it decreases prevIndex by 1, moving to the previous slide.
    );
  };

  React.useEffect(() => {
    const slideInterval = setInterval(nextSlide, 4000);
    return () => clearInterval(slideInterval); // stops the timer when the component is remoned from screen to avoid memory leaks(unnecessary memory usage)
  }, []); // the empty depency array means the effect runs only once when the component loads and not on every re-render. Otherwise if we didn't include it would cause the effect to run again and again creating multiple timers and messing the slide show
  // If we put currentIndex inside [currentIndex], a new timer would start every time the slide changes, creating too many timers running at the same time!

  return (
    <div className="bg-farmGreen py-12 mt-2 mb-0">
      <h1 className="text-center font-poppins text-xl md:text-2xl lg:text-3xl text-white font-bold mb-6">
        Our Featured Products
      </h1>
      <div className="relative m-auto">
        <div className="flex item-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct}
              initial={{ x: direction * 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -direction * 100, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full px-2 sm:w-[80%] md:w-[50%] lg:w-[60%] h-[300px] md:h-[500px] lg:h-[600px] flex-shrink-0 overflow-hidden shadow-md"
            >
              {/* <div className="w-[60%] h-[600px] flex-shrink-0 overflow-hidden shadow-md"> */}
              <img
                src={products[currentProduct].image}
                alt={products[currentProduct].title}
                className="rounded-3xl w-full h-full"
              />
              {/* </div> */}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* <div className="text-center text-white mt-4"> */}
        <motion.div
          key={currentProduct + "-text"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white mt-4"
        >
          <h3 className=" text-sm sm:text-base md:text-2xl font-semibold">{products[currentProduct].title}</h3>
          <p className="mt-2">{products[currentProduct].description}</p>
        </motion.div>
        {/* </div> */}

        <button
          className="absolute top-1/2 left-0 md:left-4 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
          onClick={prevSlide}
        >
          &#10094;
        </button>
        <button
          className="absolute top-1/2 right-0 md:right-4 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
          onClick={nextSlide}
        >
          &#10095;
        </button>

        <div className="flex justify-center mt-4">
          {products.map((_, product) => (
            <button
              key={product}
              className={`w-3 h-3 mx-1 rounded-full ${
                product === currentProduct ? "bg-white" : "bg-gray-300"
              }`}
              onClick={() => {
                setDirection(product > currentProduct ? 1 : -1);
                setCurrentProduct(product);
              }}
            ></button>
          ))}
        </div>
      </div>
      <button className=" flex mx-auto mt-5 justify-center items-center text-center font-poppins cursor-pointer px-5 bg-brightYellow w-[200px] h-[30px] text-white text-lg">
        Shop Now
      </button>

      
    </div>
    
  );
}

export default ProductSection;
