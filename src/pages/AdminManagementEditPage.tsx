import React from 'react';
import Layout from '../components/common/Layout';
import { motion } from 'framer-motion';
import { StepEditor } from './AdminKETEditPage';

const AdminManagementEditPage: React.FC = () => (
  <Layout>
    <motion.div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 px-4 md:px-8 mt-8">
      <StepEditor type="management" label="Management Quota" />
    </motion.div>
  </Layout>
);

export default AdminManagementEditPage;
