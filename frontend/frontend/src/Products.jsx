import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ProductCard from "./ProductCard";
import CONFIG from "./config"; // Import API_URL from config

function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${CONFIG.API_URL}/all-products`);
                if (!response.ok) {
                    throw new Error(
                        "Something went wrong during fetching the products"
                    );
                }

                const jsonData = await response.json();
                setProducts(jsonData);
            } catch (err) {
                console.log("Error during fetching products", err);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                {products.map((product) => (
                    <div key={product._id} className="col-md-4">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;
