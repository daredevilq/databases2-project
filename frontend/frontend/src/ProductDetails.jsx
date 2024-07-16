import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CONFIG from "./config";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [brand, setBrand] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${CONFIG.API_URL}/products/${id}`);
                if (!response.ok) {
                    throw new Error(
                        "Something went wrong during product fetching"
                    );
                }

                const jsonData = await response.json();
                setProduct(jsonData);
            } catch (error) {
                console.log(error);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product && product.brand) {
            const fetchBrand = async () => {
                try {
                    const response = await fetch(
                        `${CONFIG.API_URL}/brands/${product.brand}`
                    );
                    if (!response.ok) {
                        throw new Error(
                            "Something went wrong during brand fetching"
                        );
                    }

                    const jsonData = await response.json();
                    setBrand(jsonData);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchBrand();
        }
    }, [product]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const regularPrice = parseFloat(product.price).toFixed(2);
    const priceAfterDiscount = (
        parseFloat(product.price) *
        (1 - parseFloat(product.discountPercentage) / 100.0)
    ).toFixed(2);

    return (
        <div className="card">
            <img
                src={product.thumbnail}
                alt={product.title}
                className="card-img-top"
            />
            <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">
                    <strong>Regular Price: </strong>${regularPrice}
                </p>
                <p className="card-text">
                    <strong>Price after discount: </strong>${priceAfterDiscount}
                </p>
                <p className="card-text">
                    <strong>Discount: </strong>
                    {product.discountPercentage}%
                </p>
                <p className="card-text">
                    <strong>Category: </strong>
                    {product.category}
                </p>
                <p className="card-text">
                    <strong>Rating: </strong>
                    {product.rating}
                </p>
                <p className="card-text">
                    <strong>Stock: </strong>
                    {product.stock}
                </p>
                <p className="card-text">
                    <strong>Brand: </strong>
                    {brand ? brand.name : "Loading..."}
                </p>
                <p className="card-text">{product.description}</p>
            </div>
        </div>
    );
}

export default ProductDetails;
