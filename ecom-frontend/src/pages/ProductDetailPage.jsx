import React from "react";
import { useLocation } from "react-router-dom";
import { useDispatchCart } from "../context/CartContext";

function ProductDetailPage() {
  const { state } = useLocation();
  const product = state?.product;

  const dispatch = useDispatchCart();

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
    </div>
  );
}

export default ProductDetailPage;
