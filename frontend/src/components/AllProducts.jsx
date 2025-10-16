import { useEffect, useState } from 'react';
import { fetchProducts } from "../apiRequests/fetchProducts";
import {CartContext} from "../apiRequests/CartProvider";
import {useContext} from 'react'



function AllProducts({selectedCategory, searchTerm}) {
  const [products, setProducts] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const {addToCart } = useContext(CartContext) //// Destructure the addToCart function from context
   

  useEffect(() => {
    fetchProducts().then((products) => {
      setProducts(products);
})
   
  }, []);

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddToCart = (product) => {

    addToCart(product); // Add product to cart using the addToCart function from context
  }; 

  // //filter logic
  // const filteredProducts = selectedCategory
  //   ? products.filter((product) => product.type?.trim() === selectedCategory)
  //   : products;

// useEffect(() => {
//     const filtered = products.filter((product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredProduct(filtered);
//   }, [searchTerm, products]);

//Merging two filters
const filteredProducts = products.filter((product) => {
  const matchesCategory = selectedCategory
    ? product.type?.trim() === selectedCategory
    : true;

  const matchesSearch = product.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  return matchesCategory && matchesSearch;
});


  return (
    <div >
      <ul className='flex flex-wrap gap-4 p-4 font-poppins justify-center'>
        {filteredProducts.map((product) => (
          <li key={product.product_id}  className='border p-4 w-full sm:w-[30%] md:w-[31%] lg:w-[18%] bg-white rounded-xl shadow'>
            <img src={product.image} alt={product.name} className='w-[100px] h-[100px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]' />
            <h2 className='text-sm md:text-md lg:text-md'>{product.name}</h2>
            <p className='font-bold text-sm md:text-md lg:text-md'>Ksh {product.price}</p>
            <p className={`text-sm md:text-md lg:text-md w-full transition-all duration-300 ease-in-out ${expandedDescriptions[product.product_id] ? "whitespace-normal" : "truncate"}`}>
              {expandedDescriptions[product.product_id]
                ? product.description
                : product.description.substring(0, 30) + '...'}
            </p>
            <button onClick={() => toggleDescription(product.product_id)} className='text-brightYellow block text-sm md:text-md lg:text-md'>
              {expandedDescriptions[product.product_id] ? 'Less' : 'More'}
            </button>
            <button 
            onClick ={()=> handleAddToCart(product)} //  Trigger add to cart when clicked
            className=" flex mx-auto mt-5 justify-center items-center text-center font-poppins cursor-pointer sm:px-2 md:px-5 lg:px-5 bg-brightYellow w-[70%] md:w-[80%] lg:w-[80%] h-[30px]  text-white text-sm md:text-md rounded-full">
                Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllProducts;
