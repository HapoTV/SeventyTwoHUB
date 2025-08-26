import React, {useState, useEffect} from 'react';
import { Search, MapPin, Star, Heart, Share2, Plus, Camera, Tag } from 'lucide-react';
import {getCategories, getLocations, getProducts} from '../lib/marketplace.queries';
import type {Category, Location, Product} from '../types/marketplace.types';

const Marketplace: React.FC = () => {
    // State for UI interaction
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);

    // State for data and loading
    const [categories, setCategories] = useState<Category[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data on component mount
    useEffect(() => {
        const loadMarketplaceData = async () => {
            try {
                setIsLoading(true);
                // Fetch all data in parallel
                const [categoriesData, locationsData, productsData] = await Promise.all([
                    getCategories(),
                    getLocations(),
                    getProducts()
                ]);
                setCategories(categoriesData);
                setLocations(locationsData);
                setProducts(productsData);
            } catch (error) {
                console.error("Failed to load marketplace data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadMarketplaceData();
    }, []);

    // Derived state for filtering and display
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || product.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const featuredProducts = products.filter(product => product.featured);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div
                    className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-4 text-gray-600">Loading Marketplace...</p>
            </div>
        );
    }

  return (
    <div className="space-y-4 animate-fade-in px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Community Marketplace</h1>
          <p className="text-gray-600 text-sm">Discover and support local businesses in your community</p>
        </div>
        
        <button
          onClick={() => setShowAddProduct(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>List Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products and services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium">
                    Featured
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{product.title}</h3>
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-primary-600">{product.price}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{product.seller}</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{product.location}</span>
                  </div>
                </div>
                
                <button className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
                  Contact Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Products */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Products & Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-32 object-cover"
                />
                {product.featured && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium">
                      Featured
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-1">{product.title}</h3>
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-primary-600 text-sm">{product.price}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="truncate">{product.seller}</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{product.location}</span>
                  </div>
                </div>
                
                <button className="w-full py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-xs">
                  Contact Seller
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">List Your Product</h3>
              <button
                onClick={() => setShowAddProduct(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ×
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Describe your product"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder="R 0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
                      {categories.filter(c => c.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
                    {locations.filter(l => l.id !== 'all').map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload photos</p>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                >
                  List Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;