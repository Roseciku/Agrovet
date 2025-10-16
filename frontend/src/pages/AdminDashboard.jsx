import { useState, useEffect, useContext } from "react";
import { Dialog } from "@headlessui/react";
import { Link } from "react-router-dom";
import { AuthContext } from "../apiRequests/AuthProvider";

const apiUrl = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const { accessToken } = useContext(AuthContext); // get token
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    type: "",
    description: "",
    image: null,
  });
  const [editingProduct, setEditingProduct] = useState(null); // product being edited
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all products from backend when dashboard loads
  useEffect(() => {
    fetch(`${apiUrl}/api/allproducts`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Handle form input (for add and edit)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setNewProduct({ ...newProduct, [name]: files[0] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("type", newProduct.type);
    formData.append("description", newProduct.description);
    formData.append("image", newProduct.image);

    const res = await fetch(`${apiUrl}/api/allproducts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`, // include token
      },
      body: formData,
    });

    if (res.ok) {
      const addedProduct = await res.json();

      setProducts([...products, addedProduct]); // update list
      setNewProduct({
        name: "",
        price: "",
        type: "",
        description: "",
        image: null,
      }); // reset form
      alert("Product added successfully!");
    } else {
      alert("Failed to add product.");
    }
  };

  // Open modal for editing

  const openEditModal = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name || "",
      price: product.price || "",
      type: product.type || "",
      description: product.description || "",
      image: null, // image is not pre-filled
    });
    setIsModalOpen(true);

    console.log("Editing product:", product);
    console.log(openEditModal);
  };

  // Save edits
  const handleEditProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("type", newProduct.type);
    formData.append("description", newProduct.description);
    if (newProduct.image instanceof File) {
      formData.append("image", newProduct.image);
    }

    const res = await fetch(
      `${apiUrl}/api/allproducts/${editingProduct.product_id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`, // include token
        },
        body: formData,
      }
    );

    if (res.ok) {
      const updatedProduct = await res.json();
      setProducts(
        products.map((p) =>
          p.product_id === updatedProduct.product_id ? updatedProduct : p
        )
      );
      setIsModalOpen(false);
      setEditingProduct(null);
      alert("Product updated successfully!");
    } else {
      alert("Failed to update product.");
    }
  };

  // Delete product
  const handleDeleteProduct = async (product_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${apiUrl}/api/allproducts/${product_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`, // include token
          },
        }
      );

      if (res.ok) {
        // Remove the deleted product from state
        setProducts(products.filter((p) => p.product_id !== product_id));
        alert("Product deleted successfully!");
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Back link to Products Page */}
      <Link
        to="/products"
        className="text-blue-500 underline mb-4 inline-block"
      >
        ← Back to Products Page
      </Link>

      {/* Add Product Form */}
      <form
        onSubmit={handleAddProduct}
        className="space-y-4 border p-4 rounded mb-6"
      >
        <h2 className="text-xl font-semibold">Add New Product</h2>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="border p-2 w-full"
          accept="image/*"
          required
        />
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleChange}
          placeholder="Product Title"
          className="border p-2 w-full"
          required
        />

        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="type"
          value={newProduct.type}
          onChange={handleChange}
          placeholder="Product Type"
          className="border p-2 w-full"
          required
        />
        <textarea
          name="description"
          value={newProduct.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full"
          required
        ></textarea>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </form>

      {/* Products List */}
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.product_id} className="border p-4 rounded shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]"
            />
            <h3 className="font-bold mt-2">{product.name}</h3>
            <p>Ksh {product.price}</p>
            <p className="text-sm text-gray-600">{product.type}</p>
            <p className="text-sm text-gray-600">{product.description}</p>
            <button
              onClick={() => openEditModal(product)}
              className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteProduct(product.product_id)}
              className="bg-red-500 text-white px-3 py-1 mt-2 ml-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingProduct && (
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="relative z-50"
        >
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Modal content */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">
                Edit Product
              </h2>

              <form onSubmit={handleEditProduct} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleChange}
                  placeholder="Product Title"
                  className="border p-2 w-full"
                  required
                />
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="border p-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="type"
                  value={newProduct.type}
                  onChange={handleChange}
                  placeholder="Type: Insecticide, Fertilizer, etc"
                  className="border p-2 w-full"
                  required
                />
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="border p-2 w-full"
                  required
                ></textarea>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="border p-2 w-full"
                  accept="image/*"
                />

                <div className="flex justify-end space-x-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default AdminDashboard;
