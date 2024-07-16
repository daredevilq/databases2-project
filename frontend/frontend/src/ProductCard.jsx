import React from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Link } from "react-router-dom";

function ProductCard({ product }) {
    const regularPrice = parseFloat(product.price).toFixed(2);
    const priceAfterDiscount = (
        parseFloat(product.price) *
        (1 - parseFloat(product.discountPercentage) / 100.0)
    ).toFixed(2);

    return (
        <div className="card mb-4">
            <Link to={`/product/${product._id}`}>
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
                        <strong>Price after discount: </strong>$
                        {priceAfterDiscount}
                    </p>
                    <p className="card-text">
                        <strong>Discount: </strong>
                        {product.discountPercentage} %
                    </p>
                    <p className="card-text">
                        <strong>Category: </strong>
                        {product.category}
                    </p>
                </div>
            </Link>
        </div>
    );
}

ProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        discountPercentage: PropTypes.number.isRequired,
        rating: PropTypes.number.isRequired,
        stock: PropTypes.number.isRequired,
        brand: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
    }).isRequired,
};

export default ProductCard;
