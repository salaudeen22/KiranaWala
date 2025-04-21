import React, { useEffect, useState } from 'react';
import { 
  FiSearch, FiClock, FiTruck, FiPackage, FiRefreshCw, 
  FiStar, FiMapPin, FiShoppingBag, FiChevronRight, 
  FiHeart
} from 'react-icons/fi';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  // Fetch order status on component mount
  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Token:', token);
        const response = await fetch('http://localhost:6565/api/broadcasts/status/latest', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setOrderStatus(data.status);
        } else {
          setOrderStatus(null);
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
        setOrderStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, []);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:6565/api/customers/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setRecentOrders(response.data.data.slice(0, 2)); // Show only the 2 most recent orders
        }
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchRecentOrders();
  }, []);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await fetch("http://localhost:6565/api/products/public/all");
        const data = await response.json();
        if (data.success) {
          const shuffled = data.data.sort(() => Math.random() - 0.5); // Shuffle products
          setRecommendedProducts(shuffled.slice(0, 3)); // Select 3 random products
        }
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  const getProgress = (status) => {
    switch (status) {
      case 'pending':
        return { width: '25%', steps: ['Order placed', 'Preparing', 'On the way', 'Delivered'] };
      case 'accepted':
        return { width: '50%', steps: ['Order placed', 'Preparing', 'On the way', 'Delivered'] };
      case 'out_for_delivery':
        return { width: '75%', steps: ['Order placed', 'Preparing', 'On the way', 'Delivered'] };
      case 'delivered':
        return { width: '100%', steps: ['Order placed', 'Preparing', 'On the way', 'Delivered'] };
      default:
        return { width: '0%', steps: ['Order placed', 'Preparing', 'On the way', 'Delivered'] };
    }
  };

  const progress = orderStatus ? getProgress(orderStatus) : null;

  const categories = [
    { id: 1, name: 'Groceries', icon: <FiShoppingBag /> },
    { id: 2, name: 'Electronics', icon: <FiPackage /> },
    { id: 3, name: 'Fashion', icon: <FiStar /> },
    { id: 4, name: 'Home', icon: <FiMapPin /> },
    { id: 5, name: 'Beauty', icon: <FiRefreshCw /> },
    { id: 6, name: 'Pharmacy', icon: <FiClock /> }
  ];

  const quickActions = [
    { id: 1, name: 'Quick Delivery', icon: <FiTruck />, color: 'bg-blue-100 text-blue-600',route: "/Allproduct" },
    { id: 2, name: 'My Orders', icon: <FiPackage />, color: 'bg-green-100 text-green-600',route: "/my-orders" },
    { id: 3, name: 'Track Order', icon: <FiMapPin />, color: 'bg-purple-100 text-purple-600',route: "/" },
    { id: 4, name: 'Wishlist', icon: <FiHeart />, color: 'bg-orange-100 text-orange-600',route: "/wishlist" }
  ];

  const banners = [
    {
      id: 1,
      title: 'Summer Sale',
      subtitle: 'Up to 50% off',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/022/800/826/small_2x/summer-sale-podium-display-pile-of-sand-flowers-beach-umbrella-beach-chair-and-beach-ball-speech-bubble-space-banner-design-on-yellow-background-eps-10-illustration-vector.jpg'
    },
    {
      id: 2,
      title: 'New Arrivals',
      subtitle: 'Fresh products daily',
      image: 'https://img.freepik.com/free-vector/world-vegan-day-sale-banner-template_23-2149741503.jpg?semt=ais_hybrid&w=740'
    },
    {
      id: 3,
      title: 'Member Discount',
      subtitle: 'Extra 10% for members',
      image: 'https://yithemes.com/wp-content/uploads/2016/08/club-sale.jpghttps://yithemes.com/wp-content/uploads/2016/08/club-sale.jpg'
    }
  ];
  
  

  const deals = [
    {
      id: 1,
      name: 'Organic Apples',
      price: 2.99,
      originalPrice: 3.99,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=100&q=60'
    },
    {
      id: 2,
      name: 'Wireless Earbuds',
      price: 59.99,
      originalPrice: 79.99,
      discount: 25,
      image: 'https://www.soundscape.store/cdn/shop/files/cq5dam.web.600.600_13_980x.progressive.jpg?v=1704455840'
    },
    {
      id: 3,
      name: 'Yoga Mat',
      price: 19.99,
      originalPrice: 29.99,
      discount: 34,
      image: 'https://wiselife.in/cdn/shop/files/1_c32957ca-8b92-4e21-b32d-395717efbd7d.jpg?v=1708681826'
    },
    {
      id: 4,
      name: 'Coffee Beans',
      price: 8.99,
      originalPrice: 12.99,
      discount: 31,
      image: 'https://m.media-amazon.com/images/I/518nS4BK4zL._AC_UF1000,1000_QL80_.jpg'
    }
  ];
  
  const navigate = useNavigate();
  

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 🔍 Search Bar */}
      <div className="p-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products, brands, categories..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 🏷️ Categories */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
          Categories
          <button className="text-sm text-green-600 flex items-center">
            See all <FiChevronRight className="ml-1" />
          </button>
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2 text-green-600">{category.icon}</div>
              <span className="text-sm font-medium text-center">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🕘 Quick Access */}
      <div className="px-4 py-6 bg-white">
        <h2 className="text-xl font-bold mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
                <button
                key={action.id}
                onClick={() => navigate(action.route)}
                className={`p-3 rounded-lg flex items-center ${action.color}`}
              >
              <div className="text-xl mr-3">{action.icon}</div>
              <span className="font-medium">{action.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🔥 Banners */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Promotions</h2>
        <Slider {...carouselSettings} className="rounded-xl overflow-hidden shadow-md">
          {banners.map((banner) => (
            <div key={banner.id} className="relative h-40">
              <img 
                src={banner.image} 
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                <p className="text-white/90 text-sm">{banner.subtitle}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* 💸 Deals of the Day */}
      <div className="px-4 py-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Deals of the Day</h2>
          <div className="flex items-center bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
            <FiClock className="mr-1" /> 04:32:17 left
          </div>
        </div>
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
          {deals.map((deal) => (
            <div key={deal.id} className="flex-shrink-0 w-40 mr-4">
              <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                <img 
                  src={deal.image} 
                  alt={deal.name}
                  className="w-full h-24 object-contain mb-3"
                />
                <h3 className="font-medium text-sm line-clamp-2 mb-1">{deal.name}</h3>
                <div className="flex items-end">
                  <span className="font-bold text-green-600">₹{deal.price}</span>
                  <span className="text-xs text-gray-500 line-through ml-2">₹{deal.originalPrice}</span>
                  <span className="ml-auto text-xs bg-red-100 text-red-600 px-1 rounded">{deal.discount}% OFF</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📦 Recently Ordered */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Recently Ordered</h2>
        {loadingOrders ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent orders found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {recentOrders.map((order) => (
              <div key={order._id} className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                <img
                  src={order.items[0]?.image || "/placeholder-product.png"}
                  alt={order.items[0]?.name || "Product"}
                  className="w-16 h-16 object-cover rounded-md mr-3"
                />
                <div>
                  <h3 className="font-medium">{order.items[0]?.name || "Product"}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <button className="mt-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ❤️ Recommended For You */}
      <div className="px-4 py-6 bg-white">
        <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
        {loadingRecommended ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
            {recommendedProducts.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-32 mr-4">
                <img 
                  src={item.images[0]?.url || "/placeholder-product.png"} 
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                <div className="flex items-center mt-1">
                  <span className="font-bold text-green-600 text-sm">₹{item.finalPrice.toFixed(2)}</span>
                  <div className="ml-auto flex items-center">
                    <FiStar className="text-yellow-400 text-xs mr-1" />
                    <span className="text-xs text-gray-500">{item.rating || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🏪 Nearby Stores */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Nearby Stores</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-3">
            <FiMapPin className="text-green-600 mr-2" />
            <span className="font-medium">Your location: Downtown</span>
          </div>
          <button className="w-full py-2 bg-green-600 text-white rounded-lg">
            View Stores on Map
          </button>
        </div>
      </div>

      {/* 🚚 Track Live Orders */}
      {!loading && orderStatus && (
        <div className="px-4 py-6 bg-white">
          <h2 className="text-xl font-bold mb-4">Track Live Orders</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <FiTruck className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-medium">Your Order</h3>
                <p className="text-sm text-gray-500 capitalize">
                  {orderStatus.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                {progress.steps.map((step, index) => (
                  <span key={index}>{step}</span>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-green-600 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: progress.width }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;