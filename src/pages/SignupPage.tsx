import React from 'react';
import Layout from '../components/common/Layout';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <Layout>
      <div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 flex items-center justify-center rounded-none px-4 md:px-8 mt-8">
        <div className="w-full flex items-center justify-center rounded-2xl px-4 md:px-8">
          <SignupForm />
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;
