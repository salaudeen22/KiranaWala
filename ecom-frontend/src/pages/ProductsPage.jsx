import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiLoader } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useDispatchCart } from "../context/CartContext";
function ProductsPage() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatchCart();
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [cartLoading, setCartLoading] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:6565/api/products/public/all"
        );
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await fetch(
            "http://localhost:6565/api/customers/wishlist",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          const data = await response.json();
          if (data.success) {
            setWishlist(data.data.map((item) => item.productId));
          }
        } catch (err) {
          console.error("Failed to fetch wishlist:", err);
        }
      }
    };

    fetchProducts();
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:6565/api/customers/wishlist/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setWishlist([...wishlist, productId]);
      }
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:6565/api/customers/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setWishlist(wishlist.filter((id) => id !== productId));
      }
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  const handleWishlistToggle = async (productId) => {
    setWishlistLoading((prev) => ({ ...prev, [productId]: true }));
    if (wishlist.includes(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
    setWishlistLoading((prev) => ({ ...prev, [productId]: false }));
  };

  const handleAddToCart = async (productId) => {
    setCartLoading((prev) => ({ ...prev, [productId]: true }));
    
    try {
      const product = products.find(p => p.id === productId);
      if (product) {
        dispatch({
          type: "ADD",
          id: product.id,
          name: product.name,
          price: product.finalPrice,
          qty: 1,
          img: product.images[0]?.url || ""
        });
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setCartLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading products...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Our Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link to={`/products/${product.id}`} state={{ product }}>

              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].altText || product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">No image available</div>
                )}
              </div>
            </Link>

            <div className="p-4">
              <div className="flex justify-between items-start">
                <Link
                  to={`/products/${product.id}`}
                  className="hover:text-green-600"
                >
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                </Link>
                {user && (
                  <button
                    onClick={() => handleWishlistToggle(product.id)}
                    disabled={wishlistLoading[product.id]}
                    className={`${
                      wishlist.includes(product.id)
                        ? "text-red-500"
                        : "text-gray-400"
                    } hover:text-red-500`}
                  >
                    {wishlistLoading[product.id] ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiHeart />
                    )}
                  </button>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between mt-3">
                <div>
                  {product.discount > 0 ? (
                    <>
                      <span className="text-green-600 font-bold">
                        ₹{product.finalPrice.toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-sm line-through ml-2">
                        ₹{product.price.toFixed(2)}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded ml-2">
                        {product.discount}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-green-600 font-bold">
                      ₹{product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={cartLoading[product.id] || product.stock <= 0}
                  className={`p-2 rounded-full ${
                    product.stock > 0
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } disabled:opacity-70`}
                >
                  {cartLoading[product.id] ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiShoppingCart />
                  )}
                </button>
              </div>

              {product.stock > 0 ? (
                <div className="text-xs text-green-600 mt-2">
                  In Stock ({product.stock})
                </div>
              ) : (
                <div className="text-xs text-red-600 mt-2">Out of Stock</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
