import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import Layout from '../components/common/Layout';
import ResourceGrid from '../components/resources/ResourceGrid';
import Button from '../components/common/Button';
import { Resource, Category } from '../types';
import { getResources, getCategories } from '../utils/localStorage';
import { motion } from 'framer-motion';

const ResourcesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Initialize from URL parameters
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }

    // Fetch data
    const fetchData = () => {
      const allResources = getResources();
      const allCategories = getCategories();
      
      setResources(allResources);
      setCategories(allCategories);
      setIsLoading(false);
    };

    fetchData();
  }, [searchParams]);

  useEffect(() => {
    // Apply filters
    let result = [...resources];
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter((resource) => resource.category === selectedCategory);
    }
    
    setFilteredResources(result);
  }, [resources, searchQuery, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams();
  };

  const updateSearchParams = () => {
    const params: Record<string, string> = {};
    
    if (searchQuery) {
      params.search = searchQuery;
    }
    
    if (selectedCategory) {
      params.category = selectedCategory;
    }
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  const getCategoryName = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : '';
  };

  return (
    <Layout>
      <div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 rounded-none px-4 md:px-8 mt-8">
        <div className="w-full min-h-screen rounded-2xl bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 shadow-2xl border-2 border-blue-900 px-4 md:px-8">
          <div className="flex flex-col items-center justify-center mb-8 w-full pt-16">
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold text-gradient mb-6 drop-shadow-lg leading-tight md:leading-[1.15] pb-2 text-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Engineering Resources
            </motion.h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 w-full">
            {/* Filters - Desktop */}
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-gray-900 rounded-lg shadow-md p-4 border border-blue-900">
                <h3 className="font-medium text-gray-100 mb-4">Filter by Category</h3>
                
                <div className="space-y-2">
                  <div 
                    className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                      selectedCategory === '' ? 'bg-blue-900 text-blue-200' : 'hover:bg-gray-800 text-gray-200'
                    }`}
                    onClick={() => {
                      setSelectedCategory('');
                      updateSearchParams();
                    }}
                  >
                    All Categories
                  </div>
                  
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                        selectedCategory === category.id ? 'bg-blue-900 text-blue-200' : 'hover:bg-gray-800 text-gray-200'
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        updateSearchParams();
                      }}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Filters - Mobile */}
            {showFilters && (
              <motion.div 
                className="md:hidden col-span-1"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gray-900 rounded-lg shadow-md p-4 mb-6 border border-blue-900">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-100">Filter by Category</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div 
                      className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                        selectedCategory === '' ? 'bg-blue-900 text-blue-200' : 'hover:bg-gray-800 text-gray-200'
                      }`}
                      onClick={() => {
                        setSelectedCategory('');
                        updateSearchParams();
                        setShowFilters(false);
                      }}
                    >
                      All Categories
                    </div>
                    
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                          selectedCategory === category.id ? 'bg-blue-900 text-blue-200' : 'hover:bg-gray-800 text-gray-200'
                        }`}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          updateSearchParams();
                          setShowFilters(false);
                        }}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="col-span-1 md:col-span-3 w-full">
              {/* Search */}
              <motion.form 
                onSubmit={handleSearch}
                className="mb-6 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 px-4 pl-10 rounded-md border border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-900/80 text-gray-100 placeholder-gray-400 shadow-lg"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 rounded-r-md bg-blue-900 text-gray-100 hover:bg-blue-800 shadow"
                  >
                    Search
                  </Button>
                </div>
              </motion.form>

              {/* Active filters */}
              {hasActiveFilters && (
                <motion.div 
                  className="mb-4 flex items-center flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm text-gray-400">Active filters:</span>
                  
                  {selectedCategory && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-900 text-blue-200">
                      Category: {getCategoryName(selectedCategory)}
                      <button 
                        onClick={() => {
                          setSelectedCategory('');
                          updateSearchParams();
                        }}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  
                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-900 text-blue-200">
                      Search: {searchQuery}
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          updateSearchParams();
                        }}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </motion.div>
              )}

              {/* Resources */}
              <ResourceGrid 
                resources={filteredResources} 
                isLoading={isLoading} 
                emptyMessage={
                  hasActiveFilters
                    ? "No resources match your filters. Try adjusting your search criteria."
                    : "No resources available yet."
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;