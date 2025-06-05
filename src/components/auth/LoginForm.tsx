import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { motion } from 'framer-motion';

const LoginForm: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // email
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!identifier.trim() || !password.trim()) {
      setFormError('Please enter your email and password');
      return;
    }
    // Only allow email for Firebase
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier)) {
      setFormError('Please enter a valid email address');
      return;
    }
    const user = await login(identifier, password);
    if (user) {
      navigate('/');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-600 mt-1">Sign in to access your account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              autoComplete="username"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
        </div>
        
        {(formError || error) && (
          <div className="text-red-500 flex items-start space-x-2 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{formError || error}</p>
          </div>
        )}
        
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="mt-6"
        >
          Sign In
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-600">
        <a href="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</a>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Demo accounts:</p>
        <p className="mt-1">Admin: email: <span className="font-medium">admin@example.com</span>, password: <span className="font-medium">admin123</span></p>
        <p>User: email: <span className="font-medium">user@example.com</span>, password: <span className="font-medium">user123</span></p>
      </div>
    </motion.div>
  );
};

export default LoginForm;