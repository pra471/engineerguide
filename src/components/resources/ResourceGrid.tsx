import React from 'react';
import { Resource } from '../../types';
import ResourceCard from './ResourceCard';
import { motion } from 'framer-motion';

interface ResourceGridProps {
  resources: Resource[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const ResourceGrid: React.FC<ResourceGridProps> = ({ 
  resources, 
  isLoading = false,
  emptyMessage = 'No resources found'
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden h-72 animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {resources.map((resource, index) => (
        <motion.div
          key={resource.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <ResourceCard resource={resource} />
        </motion.div>
      ))}
    </div>
  );
};

export default ResourceGrid;