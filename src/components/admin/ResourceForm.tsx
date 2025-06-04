import React, { useState, useEffect } from 'react';
import { Resource, Category } from '../../types';
import { getCategories } from '../../utils/localStorage';
import Button from '../common/Button';
import { Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResourceFormProps {
  initialData?: Partial<Resource>;
  onSubmit: (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isLoading = false
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [downloadable, setDownloadable] = useState(initialData?.downloadable || false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load categories
    setCategories(getCategories());
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (!content.trim()) newErrors.content = 'Content is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit({
      title,
      description,
      category,
      content,
      imageUrl: imageUrl.trim() || undefined,
      downloadable
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {initialData?.id ? 'Edit Resource' : 'Add New Resource'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
        </div>
        
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          {imageUrl && (
            <div className="mt-2 p-2 border border-gray-300 rounded-md">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="h-32 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                }}
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            id="downloadable"
            type="checkbox"
            checked={downloadable}
            onChange={(e) => setDownloadable(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="downloadable" className="ml-2 block text-sm text-gray-700">
            Allow users to download this resource
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={isLoading}
          >
            <Save className="h-4 w-4 mr-1" />
            {initialData?.id ? 'Update' : 'Create'} Resource
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ResourceForm;