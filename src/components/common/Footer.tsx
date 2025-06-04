import React from 'react';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 text-gray-200 py-8 shadow-inner w-full">
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-none">
        <div className="flex items-center mb-4 md:mb-0">
          <BookOpen className="h-6 w-6 mr-2 text-yellow-300 animate-float" />
          <span className="text-lg font-bold text-gradient">EngineerGuide</span>
        </div>
        
        <div className="flex space-x-4 mb-4 md:mb-0">
          <a href="#" className="hover:text-yellow-300 transition-colors">
            <Github className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-blue-300 transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-pink-200 transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
        
        <div className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} EngineerGuide. All rights reserved.
        </div>
      </div>
      
      <div className="mt-6 text-sm text-center text-gray-400">
        <p>Empowering the next generation of engineers with color and creativity.</p>
      </div>
    </footer>
  );
};

export default Footer;