import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import ResourceForm from '../components/admin/ResourceForm';
import CategoryAdminPanel from '../components/admin/CategoryAdminPanel';
import { Resource } from '../types';
import { useAuth } from '../context/AuthContext';
import { getResources, addResource, updateResource, deleteResource, toggleDownloadable } from '../utils/localStorage';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResource, setDeletingResource] = useState<string | null>(null);
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const navigate = useNavigate();
  
  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    // Fetch resources
    const fetchResources = () => {
      setIsLoading(true);
      const allResources = getResources();
      setResources(allResources);
      setIsLoading(false);
    };

    fetchResources();
  }, []);

  const handleAddResource = (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Add resource to local storage
    const newResource = addResource(data);
    
    // Update local state
    setResources([...resources, newResource]);
    setIsAddingResource(false);
  };

  const handleUpdateResource = (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingResource) return;
    
    // Update resource in local storage
    const updated = updateResource(editingResource.id, data);
    
    if (updated) {
      // Update local state
      setResources(
        resources.map(resource => 
          resource.id === editingResource.id ? updated : resource
        )
      );
    }
    
    setEditingResource(null);
  };

  const handleDeleteResource = (id: string) => {
    // Delete from local storage
    deleteResource(id);
    
    // Update local state
    setResources(resources.filter(resource => resource.id !== id));
    setDeletingResource(null);
  };

  const handleToggleDownloadable = (id: string) => {
    // Toggle in local storage
    const updated = toggleDownloadable(id);
    
    if (updated) {
      // Update local state
      setResources(
        resources.map(resource => 
          resource.id === id ? updated : resource
        )
      );
    }
  };

  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderResourceTable = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded mb-4"></div>
          <div className="h-12 bg-gray-300 rounded mb-4"></div>
          <div className="h-12 bg-gray-300 rounded mb-4"></div>
        </div>
      );
    }

    if (filteredResources.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {searchQuery 
              ? "No resources match your search query" 
              : "No resources available"}
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-center">Downloadable</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredResources.map((resource) => (
              <motion.tr 
                key={resource.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-100">{resource.title}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-gray-300 text-sm truncate max-w-xs">{resource.description}</div>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleToggleDownloadable(resource.id)}
                    className={`inline-flex items-center ${
                      resource.downloadable ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {resource.downloadable ? (
                      <ToggleRight className="h-6 w-6" />
                    ) : (
                      <ToggleLeft className="h-6 w-6" />
                    )}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingResource(resource)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit resource"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setDeletingResource(resource.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete resource"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Layout>
      <div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 rounded-none px-4 md:px-8 mt-8">
        <motion.div 
          className="rounded-2xl flex flex-col md:flex-row md:items-center justify-between mb-8 bg-gray-900 rounded-none p-6 border border-blue-900 w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-100 mb-4 md:mb-0">Admin Dashboard</h1>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 px-4 pl-10 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <Button
              onClick={() => setIsAddingResource(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Resource
            </Button>
          </div>
        </motion.div>
        <motion.div 
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence>
            {isAddingResource ? (
              <ResourceForm
                onSubmit={handleAddResource}
                onCancel={() => setIsAddingResource(false)}
              />
            ) : editingResource ? (
              <ResourceForm
                initialData={editingResource}
                onSubmit={handleUpdateResource}
                onCancel={() => setEditingResource(null)}
              />
            ) : (
              renderResourceTable()
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Delete confirmation modal */}
        {deletingResource && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 p-6 rounded-lg shadow-xl max-w-md w-full border border-pink-900"
            >
              <h2 className="text-xl font-bold text-gray-100 mb-4">Confirm Deletion</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this resource? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setDeletingResource(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deletingResource && handleDeleteResource(deletingResource)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-end">
          <Button variant="outline" onClick={() => navigate('/admin/admission/ket')}>
            Edit KCET Admission Steps
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/admission/comedk')}>
            Edit COMEDK Admission Steps
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/admission/management')}>
            Edit Management Quota Steps
          </Button>
          <Button variant="outline" onClick={() => setShowCategoryPanel(!showCategoryPanel)}>
            {showCategoryPanel ? 'Hide Category Management' : 'Edit Categories'}
          </Button>
        </div>
        {showCategoryPanel && <CategoryAdminPanel />}
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;