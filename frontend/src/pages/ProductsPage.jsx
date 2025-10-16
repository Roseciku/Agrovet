import { useContext, useEffect, useState } from "react";
import ProductsNavbar from "../components/ProductsNavbar";
import AllProducts from "../components/AllProducts";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../apiRequests/CartProvider";

const apiUrl = import.meta.env.VITE_API_URL;

function ProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {

    const saveProductCart = async (product_id) => {
      const productRes = await fetch(
        `${apiUrl}/api/product/${product_id}`
      );

      if (!productRes.ok) return;

      const product = await productRes.json(); //fetch that single product

      await addToCart(product);
     
      navigate('/products')
    }; 

    const queryParams = new URLSearchParams(location.search);
    const redirect = queryParams.get("redirect");
    const product_id = queryParams.get("product_id");

    if (redirect === "add-to-cart" && product_id) {
      saveProductCart(product_id)
    }
  }, [location.search]);

  return (
    <div>
      <ProductsNavbar setSelectedCategory={setSelectedCategory} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <AllProducts  selectedCategory={selectedCategory} searchTerm={searchTerm}/>
    </div>
  );
}

export default ProductsPage;
