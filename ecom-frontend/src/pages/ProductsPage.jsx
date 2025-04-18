import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiLoader, FiFilter, FiX, FiSearch } from "react-icons/fi";
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

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOption, setSortOption] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:6565/api/categories");
        const data = await response.json();
        if (data.success) setCategories(data.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchProducts();
    fetchWishlist();
    fetchCategories();
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

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      (selectedCategory === "all" || product.category === selectedCategory) &&
      (product.finalPrice >= priceRange[0] && product.finalPrice <= priceRange[1]) &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch(sortOption) {
        case "price-low": return a.finalPrice - b.finalPrice;
        case "price-high": return b.finalPrice - a.finalPrice;
        case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
        case "rating": return b.rating - a.rating;
        default: return 0;
      }
    });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange([0, 10000]);
    setSortOption("featured");
  };

  if (loading)
    return <div className="text-center py-8">Loading products...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Our Products</h1>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 bg-gray-100 rounded-lg"
      >
        <FiFilter /> Filters
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Filters - Left Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-md sticky top-4">
            <h3 className="font-bold text-lg mb-4 flex justify-between items-center">
              Filters
              <button 
                onClick={clearFilters}
                className="text-sm text-green-600 hover:underline"
              >
                Clear all
              </button>
            </h3>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Product name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full px-3 py-1 border border-gray-300 rounded"
                />
                <span>to</span>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full px-3 py-1 border border-gray-300 rounded"
                />
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="bg-white h-full w-4/5 max-w-sm p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Mobile filter content (same as desktop filters) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Product name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2 border border-gray-300 rounded-lg"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {/* Active filters bar */}
          {(searchTerm || selectedCategory !== "all" || priceRange[1] < 10000) && (
            <div className="bg-white p-3 rounded-lg shadow-sm mb-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                  Search: {searchTerm}
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={16} />
                  </button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                  Category: {categories.find(c => c._id === selectedCategory)?.name || selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={16} />
                  </button>
                </span>
              )}
              {priceRange[1] < 10000 && (
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                  Price: up to ₹{priceRange[1]}
                  <button 
                    onClick={() => setPriceRange([0, 10000])}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={16} />
                  </button>
                </span>
              )}
              <button 
                onClick={clearFilters}
                className="ml-auto text-sm text-green-600 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/products/${product.id}`} state={{ product }}>
                    <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].altText || product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400">No image available</div>
                      )}
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/products/${product.id}`}
                        state={{ product }}
                        className="hover:text-green-600"
                      >
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                      </Link>
                      {user && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleWishlistToggle(product.id);
                          }}
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
                          </>
                        ) : (
                          <span className="text-green-600 font-bold">
                            ₹{product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product.id);
                        }}
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
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">No products match your filters.</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;