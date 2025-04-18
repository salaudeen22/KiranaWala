import React, { useState, useEffect } from 'react';
import { FiHeart, FiTrash2, FiShoppingCart, FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useDispatchCart } from '../context/CartContext';

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [removingId, setRemovingId] = useState(null);
    const [addingToCartId, setAddingToCartId] = useState(null);
    const dispatch = useDispatchCart();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:6565/api/customers/wishlist', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                setWishlist(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch wishlist');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteWishlistItem = async (productId) => {
        if (!window.confirm('Are you sure you want to remove this item from your wishlist?')) return;

        try {
            setRemovingId(productId);
            const response = await fetch(`http://localhost:6565/api/customers/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setWishlist(wishlist.filter(item => item.productId._id !== productId));
            } else {
                throw new Error(data.message || 'Failed to delete wishlist item');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setRemovingId(null);
        }
    };

    const handleAddToCart = (product) => {
        setAddingToCartId(product._id);
        dispatch({
            type: "ADD",
            id: product._id,
            name: product.name,
            price: product.finalPrice || product.price,
            qty: 1,
            img: product.images?.[0]?.url || ""
        });
        setTimeout(() => setAddingToCartId(null), 1000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FiLoader className="animate-spin text-4xl text-green-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <FiHeart className="mr-3 text-pink-500" /> My Wishlist
                </h1>
                {wishlist.length > 0 && (
                    <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                    </span>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map(item => {
                        const product = item.productId;
                        return (
                            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <Link to={`/products/${product._id}`} className="block">
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        {product.images?.[0]?.url ? (
                                            <img 
                                                src={product.images[0].url} 
                                                alt={product.name}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No image available
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                <div className="p-4">
                                    <Link to={`/products/${product._id}`}>
                                        <h3 className="font-semibold text-lg mb-1 hover:text-green-600 transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    
                                    <div className="flex items-center justify-between mt-2">
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
                                    </div>

                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={() => deleteWishlistItem(product._id)}
                                            disabled={removingId === product._id}
                                            className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            {removingId === product._id ? (
                                                <FiLoader className="animate-spin mr-1" />
                                            ) : (
                                                <FiTrash2 className="mr-1" />
                                            )}
                                            Remove
                                        </button>

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={addingToCartId === product._id}
                                            className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                                        >
                                            {addingToCartId === product._id ? (
                                                <FiLoader className="animate-spin mr-1" />
                                            ) : (
                                                <FiShoppingCart className="mr-1" />
                                            )}
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                        <FiHeart className="mx-auto text-5xl text-pink-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-6">Save your favorite items here for later</p>
                        <Link 
                            to="/products" 
                            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Wishlist;