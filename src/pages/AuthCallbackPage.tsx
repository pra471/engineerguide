import React from 'react';

const AuthCallbackPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900">
      <div className="bg-white rounded-lg shadow-md p-8 min-w-[320px] text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Processing...</h2>
        <p className="text-gray-700">Please wait while we verify your email or reset your password.</p>
        <p className="text-gray-500 mt-4">If you are not redirected automatically, please return to the app and log in.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
