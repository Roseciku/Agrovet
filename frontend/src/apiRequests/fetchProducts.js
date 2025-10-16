

const apiUrl = import.meta.env.VITE_API_URL;

export async function fetchProducts() {
    const response = await fetch(`${apiUrl}/api/allproducts`);
    const data = await response.json();
    return data.products || data; // Return correct shape
  }
  


