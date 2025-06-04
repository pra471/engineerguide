import React from 'react';
import Layout from '../components/common/Layout';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => (
  <Layout>
    <div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 flex items-center justify-center rounded-none px-4 md:px-8 mt-8">
      <div className="w-full flex items-center justify-center rounded-2xl px-4 md:px-8">
        <ForgotPasswordForm />
      </div>
    </div>
  </Layout>
);

export default ForgotPasswordPage;
