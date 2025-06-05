import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import { motion } from 'framer-motion';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const { resetPassword, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!email.trim()) {
      setFormError('Please enter your email');
      return;
    }
    // Validate email format
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    const ok = await resetPassword(email);
    if (ok) setSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
        <p className="text-gray-600 mt-1">Enter your email to receive a password reset link</p>
      </div>
      {submitted ? (
        <div className="text-green-600 text-center">Check your email for a password reset link.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          {(formError || error) && <div className="text-red-500 text-sm">{formError || error}</div>}
          <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">Send Reset Link</Button>
        </form>
      )}
    </motion.div>
  );
};

export default ForgotPasswordForm;
