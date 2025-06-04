import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookOpen, Search, ChevronRight } from 'lucide-react';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import { Resource, Category } from '../types';
import { getResources, getCategories } from '../utils/localStorage';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const [featuredResources, setFeaturedResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get featured resources (latest 3 resources)
    const resources = getResources();
    setFeaturedResources(resources.slice(0, 3));
    
    // Get categories
    setCategories(getCategories());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/resources?search=${encodeURIComponent(searchQuery)}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 rounded-none px-4 md:px-8 mt-8">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 relative overflow-hidden w-full rounded-xl mb-8 px-4 md:px-8">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <div className="absolute w-96 h-96 bg-pink-900 rounded-full opacity-20 blur-3xl animate-float" style={{top: '-6rem', left: '-6rem'}} />
            <div className="absolute w-96 h-96 bg-blue-900 rounded-full opacity-20 blur-3xl animate-float" style={{bottom: '-6rem', right: '-6rem'}} />
          </div>
          <div className="relative z-10 text-center w-full">
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold text-gradient mb-6 drop-shadow-lg leading-tight md:leading-[1.15] pb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Engineering Student Guide
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Your vibrant hub for resources, projects, and collaboration.
            </motion.p>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full md:w-96 px-5 py-3 rounded-xl border-2 border-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg bg-gray-800/80 text-gray-100 shadow"
                placeholder="Search resources, topics, or projects..."
              />
              <Button type="submit" size="lg" variant="primary" className="shadow-lg">Search</Button>
            </form>
          </div>
        </section>

        {/* Featured Resources Section */}
        <section className="py-12 bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 rounded-xl my-12 w-full px-4 md:px-8">
          <div className="w-full">
            <div className="flex justify-between items-center mb-8 w-full">
              <h2 className="text-2xl font-bold text-gray-100">Featured Resources</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/resources')}
                className="border-blue-900 text-gray-100 hover:bg-gray-800"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full">
              {featuredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-gray-800/90 rounded-2xl shadow-xl border-2 border-pink-900 p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300 w-full"
                >
                  {resource.imageUrl && (
                    <div className="h-40 overflow-hidden rounded-lg w-full mb-4">
                      <img 
                        src={resource.imageUrl} 
                        alt={resource.title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gradient mb-2 drop-shadow">{resource.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{resource.description}</p>
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/resources/${resource.id}`)}
                      className="bg-gradient-to-r from-pink-900 via-yellow-800 to-blue-900 text-gray-100 font-bold shadow hover:from-yellow-700 hover:to-blue-800"
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Read More
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 w-full px-4 md:px-8">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Browse by Category</h2>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={item}
                  className="bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 rounded-2xl shadow-xl border-2 border-blue-900 p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300 w-full"
                >
                  <div className="flex-1 flex flex-col items-center">
                    <Bookmark className="h-8 w-8 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold text-gradient mb-2 drop-shadow">{category.name}</h3>
                    <p className="text-gray-300 text-sm mb-4 text-center">{category.description}</p>
                  </div>
                  <Button 
                    variant="primary"
                    className="mt-auto bg-gradient-to-r from-pink-900 via-yellow-800 to-blue-900 text-gray-100 font-bold shadow hover:from-yellow-700 hover:to-blue-800"
                    onClick={() => navigate(`/resources?category=${category.id}`)}
                  >
                    Explore
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section 
          className="py-16 bg-blue-600 text-white rounded-xl my-12 w-full px-4 md:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="w-full text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to enhance your engineering knowledge?</h2>
            <p className="text-xl text-blue-100 mb-8 w-full">
              Access comprehensive guides, resources, and materials designed specifically for engineering students
            </p>
            <Button 
              onClick={() => navigate('/resources')}
              className="bg-white text-blue-600 hover:bg-blue-50"
              size="lg"
            >
              Explore Resources
            </Button>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default HomePage;
