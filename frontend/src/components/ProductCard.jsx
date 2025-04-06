import React from 'react';
import { FiEdit2 } from 'react-icons/fi';

const ProductCard = ({ product, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-100">
        {product.images?.[0]?.url ? (
          <img 
            src={product.images[0].url} 
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300';
              e.target.className = 'w-full h-full object-cover bg-gray-200';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-800 truncate">{product.name}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <div>
            <span className="font-bold text-gray-900">₹{product.price}</span>
            {product.discount > 0 && (
              <span className="ml-2 text-sm text-green-600">
                ({product.discount}% off)
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className={`text-sm px-2 py-1 rounded-full ${
              product.stock > 10 ? 'bg-green-100 text-green-800' : 
              product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock} in stock
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onEdit(product)}
          className="mt-3 w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <FiEdit2 className="mr-2" />
          Edit
        </button>
      </div>
    </div>
  );
};

export default ProductCard;