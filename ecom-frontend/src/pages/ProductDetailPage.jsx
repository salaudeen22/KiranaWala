import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatchCart } from "../context/CartContext";
import axios from "axios";
import { FaStar } from "react-icons/fa";

function ProductDetailPage() {
  const { state } = useLocation();
  const product = state?.product;

  const dispatch = useDispatchCart();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product?.id) {
      setLoading(true);
      axios
        .get(`http://localhost:6565/api/reviews/retailer/${product.id}`)
        .then((response) => {
          setReviews(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
          setLoading(false);
        });
    }
  }, [product?.id]);

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center py-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or may have been removed.</p>
        </div>
      </div>
    );

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 flex items-center justify-center h-96 bg-gray-50">
            <img
              src={product.images[0]?.url || "/placeholder-product.png"}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.src = "/placeholder-product.png";
              }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex p-4 space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`${product.name} ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border border-gray-200 cursor-pointer hover:border-blue-500"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {reviews.length > 0 && (
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.finalPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="ml-3 text-lg text-gray-500 line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="ml-3 bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>
            {product.discount > 0 && (
              <p className="text-sm text-green-600 mt-1">
                You save ₹{(product.price - product.finalPrice).toFixed(2)}
              </p>
            )}
          </div>

          <div className="flex space-x-4">
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Add to Cart
            </button>
          
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Delivery Options</h3>
            <div className="flex items-center text-sm text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Free delivery on orders over ₹500
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
          Customer Reviews
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`h-5 w-5 ${
                          star <= review.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-semibold text-lg text-gray-800">{review.customerName}</h4>
                <p className="text-gray-700 mt-1">{review.review}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No reviews yet</h3>
            <p className="mt-1 text-gray-500">Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;