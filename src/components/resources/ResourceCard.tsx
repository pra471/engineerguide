import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, FileText } from 'lucide-react';
import { Resource } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Card from '../common/Card';

interface ResourceCardProps {
  resource: Resource;
  showCategory?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, showCategory = true }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const canDownload = resource.downloadable || isAdmin;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card interactive className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 shadow-xl hover:shadow-2xl border-2 border-blue-900 hover:border-pink-900 transition-all duration-300">
      {resource.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={resource.imageUrl}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-4 flex-grow flex flex-col bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 rounded-b-2xl">
        <h3 className="text-lg font-bold text-gradient mb-2 drop-shadow">{resource.title}</h3>
        <p className="text-gray-200 text-sm mb-4 flex-grow">{resource.description}</p>
        
        <div className="flex flex-wrap justify-between items-center mt-auto">
          <div className="text-xs text-gray-400">
            {formatDate(resource.updatedAt)}
          </div>
          
          <div className="flex space-x-2 mt-2">
            <Link 
              to={`/resources/${resource.id}`}
              className="text-pink-400 hover:text-indigo-300 inline-flex items-center text-sm font-semibold transition-colors"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
            
            {canDownload && (
              <button 
                className={`inline-flex items-center text-sm ${
                  canDownload 
                    ? 'text-green-400 hover:text-green-600' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                disabled={!canDownload}
                title={canDownload ? 'Download resource' : 'Download not allowed'}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResourceCard;