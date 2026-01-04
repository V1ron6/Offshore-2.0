/**
 * AdvancedSearch Component - Product search with filters
 */

import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

const AdvancedSearch = ({ onSearch, categories = [], onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    inStock: false
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      inStock: false
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.inStock || searchTerm;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition ${
            showFilters || hasActiveFilters
              ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-600 dark:text-red-400'
              : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          <Filter size={18} />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          )}
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="p-2.5 text-gray-500 hover:text-red-500 transition"
            title="Clear all filters"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Min Price
            </label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="$0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Max Price
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="No limit"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* In Stock Only */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
            </label>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
              Search: "{searchTerm}"
              <button onClick={() => { setSearchTerm(''); onSearch?.(''); }} className="hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
              Category: {filters.category}
              <button onClick={() => handleFilterChange('category', '')} className="hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          )}
          {filters.minPrice && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
              Min: ${filters.minPrice}
              <button onClick={() => handleFilterChange('minPrice', '')} className="hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          )}
          {filters.maxPrice && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
              Max: ${filters.maxPrice}
              <button onClick={() => handleFilterChange('maxPrice', '')} className="hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          )}
          {filters.inStock && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full">
              In Stock
              <button onClick={() => handleFilterChange('inStock', false)} className="hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
