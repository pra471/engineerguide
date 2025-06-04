import React from 'react';
import Layout from '../components/common/Layout';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { useParams } from 'react-router-dom';

const admissionDetails = {
  ket: [
    'Register for the KET exam on the official website.',
    'Download your admit card when available.',
    'Appear for the KET exam at your designated center.',
    'Check your results online.',
    'Participate in the counseling process and select your preferred colleges.',
    'Complete document verification and pay the admission fee.'
  ],
  comedk: [
    'Register for COMEDK UGET on the official portal.',
    'Fill out the application form and upload required documents.',
    'Download your admit card.',
    'Take the COMEDK UGET exam.',
    'Check your results and download your rank card.',
    'Attend online counseling and select colleges/courses.',
    'Complete admission formalities at the allotted college.'
  ],
  management: [
    'Contact the college admission office directly.',
    'Fill out the management quota application form.',
    'Submit required documents and pay the application fee.',
    'Attend the interview/counseling if required.',
    'Receive admission offer and pay the admission fee.',
    'Complete document verification and join the college.'
  ]
};

const detailTitles = {
  ket: 'KET Admission Steps',
  comedk: 'COMEDK Admission Steps',
  management: 'Management Quota Steps'
};

const AdmissionDetailPage: React.FC = () => {
  const { type } = useParams<{ type: 'ket' | 'comedk' | 'management' }>();
  if (!type || !(type in admissionDetails)) return null;
  return (
    <Layout>
      <div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 rounded-none px-4 md:px-8 mt-8">
        <div className="w-full min-h-screen rounded-2xl bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 shadow-2xl border-2 border-blue-900 px-4 md:px-8 flex flex-col items-center justify-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold text-gradient mb-6 drop-shadow-lg leading-tight md:leading-[1.15] pb-2 text-center mt-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {detailTitles[type as keyof typeof detailTitles]}
          </motion.h1>
          <ol className="list-decimal text-gray-200 text-left pl-6 mb-6 max-w-2xl w-full">
            {admissionDetails[type as keyof typeof admissionDetails].map((step, idx) => (
              <li key={idx} className="mb-2">{step}</li>
            ))}
          </ol>
          <Button onClick={() => window.history.back()} className="bg-blue-900 text-gray-100">Back</Button>
        </div>
      </div>
    </Layout>
  );
};

export default AdmissionDetailPage;
