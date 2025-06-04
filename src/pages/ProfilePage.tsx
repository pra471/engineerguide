import React from 'react';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="py-12 min-h-screen w-full flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Not signed in</h2>
            <p className="text-gray-600">Please log in to view your profile.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12 min-h-screen w-full flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 min-w-[320px]">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Profile</h2>
          <div className="mb-2 text-gray-900"><span className="font-semibold">Email:</span> {user.email}</div>
          <div className="mb-2 text-gray-900"><span className="font-semibold">User ID:</span> {user.id}</div>
          <div className="mb-2 text-gray-900"><span className="font-semibold">Role:</span> {user.role || 'user'}</div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
