import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Edit, Trash, Eye, Clock } from 'lucide-react';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import { Resource, Category } from '../types';
import { getResourceById, getCategoryById, deleteResource, toggleDownloadable, getResources } from '../utils/localStorage';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import ResourceForm from '../components/admin/ResourceForm';

const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resource, setResource] = useState<Resource | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!id) return;

    const fetchResource = () => {
      setIsLoading(true);
      
      const foundResource = getResourceById(id);
      
      if (foundResource) {
        setResource(foundResource);
        
        // Get the category
        const resourceCategory = getCategoryById(foundResource.category);
        if (resourceCategory) {
          setCategory(resourceCategory);
        }
      }
      
      setIsLoading(false);
    };

    fetchResource();
  }, [id]);

  const handleDelete = () => {
    if (!id) return;
    
    deleteResource(id);
    navigate('/resources');
  };

  const handleToggleDownloadable = () => {
    if (!id || !resource) return;
    
    const updatedResource = toggleDownloadable(id);
    if (updatedResource) {
      setResource(updatedResource);
    }
  };

  const handleUpdateResource = (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!id || !resource) return;
    
    // In a real app, this would be an API call
    const updatedResource = {
      ...resource,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('resources', JSON.stringify(
      getResources().map(r => r.id === id ? updatedResource : r)
    ));
    
    setResource(updatedResource);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-300 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!resource) {
    return (
      <Layout>
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Resource Not Found</h1>
        </div>
      </Layout>
    );
  }

  if (isEditing) {
    return (
      <Layout>
        <div className="py-8">
          <button 
            onClick={() => setIsEditing(false)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Resource
          </button>
          
          <ResourceForm
            initialData={resource}
            onSubmit={handleUpdateResource}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 rounded-none px-4 md:px-8 mt-8">
        <motion.div
          className="rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back button */}
          <button 
            onClick={() => navigate('/resources')}
            className="flex items-center text-blue-400 hover:text-white mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Resources
          </button>
          {/* Resource header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gradient mb-2 drop-shadow">{resource.title}</h1>
                <div className="flex flex-wrap items-center text-sm text-gray-400 gap-x-4 gap-y-2">
                  {category && (
                    <span className="inline-flex items-center bg-blue-900 text-blue-200 px-2 py-1 rounded">
                      {category.name}
                    </span>
                  )}
                  <span className="inline-flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created: {formatDate(resource.createdAt)}
                  </span>
                  <span className="inline-flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Updated: {formatDate(resource.updatedAt)}
                  </span>
                </div>
              </div>
              {/* Admin actions */}
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-blue-900 text-gray-100 hover:bg-gray-800"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant={resource.downloadable ? 'outline' : 'success'} 
                    size="sm"
                    onClick={handleToggleDownloadable}
                    className="border-blue-900 text-gray-100 hover:bg-gray-800"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {resource.downloadable ? 'Disable Download' : 'Enable Download'}
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => setIsDeleting(true)}
                    className="border-pink-900 text-gray-100 hover:bg-gray-800"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* Resource image */}
          {resource.imageUrl && (
            <div className="mb-8">
              <img 
                src={resource.imageUrl} 
                alt={resource.title} 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
          {/* Resource description */}
          <div className="bg-gray-900 p-4 rounded-lg mb-6 border border-blue-900">
            <h2 className="text-xl font-semibold mb-2 text-gray-100">Overview</h2>
            <p className="text-gray-300">{resource.description}</p>
          </div>
          {/* Resource content */}
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Content</h2>
            <div className="bg-gray-900 p-6 rounded-lg border border-blue-900">
              {resource.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          {/* Download section */}
          <div className="mt-8 bg-blue-950 p-6 rounded-lg border border-blue-900">
            <h2 className="text-xl font-semibold text-blue-200 mb-3">Resource Download</h2>
            <p className="text-gray-300 mb-4">
              {resource.downloadable 
                ? "This resource is available for download. Click the button below to get your copy."
                : "This resource is not currently available for download. Please check back later or contact an administrator."}
            </p>
            <Button
              variant={resource.downloadable ? 'success' : 'outline'}
              size="md"
              className="border-blue-900 text-gray-100 hover:bg-gray-800"
              disabled={!resource.downloadable && !isAdmin}
              onClick={() => {
                // Download as .txt file
                const blob = new Blob([
                  `Title: ${resource.title}\n\nDescription: ${resource.description}\n\nContent:\n${resource.content}`
                ], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'resource'}.txt`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }, 100);
              }}
            >
              <Download className="h-5 w-5 mr-2" />
              {isAdmin && !resource.downloadable 
                ? "Admin Download" 
                : "Download Resource"}
            </Button>
          </div>
        </motion.div>
        {/* Delete confirmation modal */}
        {isDeleting && (
          <div className="fixed inset-0 bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 bg-opacity-95 flex items-center justify-center z-50">
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
                  onClick={() => setIsDeleting(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResourceDetailPage;