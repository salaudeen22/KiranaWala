import React, { useState } from 'react';
import { 
  FiSearch, FiClock, FiTruck, FiPackage, FiRefreshCw, 
  FiStar, FiMapPin, FiShoppingBag, FiChevronRight 
} from 'react-icons/fi';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'Groceries', icon: <FiShoppingBag /> },
    { id: 2, name: 'Electronics', icon: <FiPackage /> },
    { id: 3, name: 'Fashion', icon: <FiStar /> },
    { id: 4, name: 'Home', icon: <FiMapPin /> },
    { id: 5, name: 'Beauty', icon: <FiRefreshCw /> },
    { id: 6, name: 'Pharmacy', icon: <FiClock /> }
  ];

  const quickActions = [
    { id: 1, name: 'Quick Delivery', icon: <FiTruck />, color: 'bg-blue-100 text-blue-600' },
    { id: 2, name: 'My Orders', icon: <FiPackage />, color: 'bg-green-100 text-green-600' },
    { id: 3, name: 'Track Order', icon: <FiMapPin />, color: 'bg-purple-100 text-purple-600' },
    { id: 4, name: 'Refill', icon: <FiRefreshCw />, color: 'bg-orange-100 text-orange-600' }
  ];

  const banners = [
    {
      id: 1,
      title: 'Summer Sale',
      subtitle: 'Up to 50% off',
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 2,
      title: 'New Arrivals',
      subtitle: 'Fresh products daily',
      image: 'https://images.unsplash.com/photo-1586281380381-934b17f53cda?auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 3,
      title: 'Member Discount',
      subtitle: 'Extra 10% for members',
      image: 'https://images.unsplash.com/photo-1606813903174-f73d0df4b3a3?auto=format&fit=crop&w=800&q=60'
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
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224c78c?auto=format&fit=crop&w=100&q=60'
    },
    {
      id: 3,
      name: 'Yoga Mat',
      price: 19.99,
      originalPrice: 29.99,
      discount: 34,
      image: 'https://images.unsplash.com/photo-1600195077078-3ec9c66dfd47?auto=format&fit=crop&w=100&q=60'
    },
    {
      id: 4,
      name: 'Coffee Beans',
      price: 8.99,
      originalPrice: 12.99,
      discount: 31,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=100&q=60'
    }
  ];
  

  const recentOrders = [
    {
      id: 1,
      name: 'Milk & Bread',
      date: '2 days ago',
      image: 'https://images.unsplash.com/photo-1587910017075-b317fdd238cf?auto=format&fit=crop&w=80&q=60'
    },
    {
      id: 2,
      name: 'Phone Case',
      date: '1 week ago',
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224c78c?auto=format&fit=crop&w=80&q=60'
    }
  ];
  
  const recommended = [
    {
      id: 1,
      name: 'Protein Powder',
      price: 24.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1600180758890-6fc71d16943d?auto=format&fit=crop&w=120&q=60'
    },
    {
      id: 2,
      name: 'Bluetooth Speaker',
      price: 45.99,
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1606813903174-f73d0df4b3a3?auto=format&fit=crop&w=120&q=60'
    },
    {
      id: 3,
      name: 'Organic Tea',
      price: 5.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1612024771450-8b1e2a426f50?auto=format&fit=crop&w=120&q=60'
    }
  ];
  

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
                  <span className="font-bold text-green-600">${deal.price}</span>
                  <span className="text-xs text-gray-500 line-through ml-2">${deal.originalPrice}</span>
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
        <div className="grid grid-cols-2 gap-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center">
              <img 
                src={order.image} 
                alt={order.name}
                className="w-16 h-16 object-cover rounded-md mr-3"
              />
              <div>
                <h3 className="font-medium">{order.name}</h3>
                <p className="text-xs text-gray-500">{order.date}</p>
                <button className="mt-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
                  Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ❤️ Recommended For You */}
      <div className="px-4 py-6 bg-white">
        <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
          {recommended.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-32 mr-4">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
              <div className="flex items-center mt-1">
                <span className="font-bold text-green-600 text-sm">${item.price}</span>
                <div className="ml-auto flex items-center">
                  <FiStar className="text-yellow-400 text-xs mr-1" />
                  <span className="text-xs text-gray-500">{item.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
      <div className="px-4 py-6 bg-white">
        <h2 className="text-xl font-bold mb-4">Track Live Orders</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <FiTruck className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="font-medium">Order #12345</h3>
              <p className="text-sm text-gray-500">Out for delivery</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Order placed</span>
              <span>On the way</span>
              <span>Delivered</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-green-600 h-1.5 rounded-full w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;