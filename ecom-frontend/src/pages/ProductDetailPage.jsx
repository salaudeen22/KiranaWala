import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatchCart } from "../context/CartContext";
import axios from "axios";

function ProductDetailPage() {
  const { state } = useLocation();
  const product = state?.product;

  const dispatch = useDispatchCart();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (product?.id) {
      axios
        .get(`http://localhost:6565/api/reviews/retailer/${product.id}`)
        .then((response) => setReviews(response.data))
        .catch((error) => console.error("Error fetching reviews:", error));
    }
  }, [product?.id]);

  if (!product)
    return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg p-4">
          <img
            src={product.images[0]?.url || ""}
            alt={product.name}
            className="w-full h-96 object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="text-2xl font-bold mb-6">
            ₹{product.finalPrice.toFixed(2)}
            {product.discount > 0 && (
              <span className="ml-3 text-sm text-gray-500 line-through">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() =>
              dispatch({
                type: "ADD",
                id: product.id,
                name: product.name,
                price: product.finalPrice,
                qty: 1,
                img: product.images[0]?.url || "",
              })
            }
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="mb-4">
              <p className="font-bold">{review.customerName}</p>
              <p className="text-sm text-gray-600">Rating: {review.rating}/5</p>
              <p>{review.review}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
