import React from 'react';
import Layout from '../components/common/Layout';

const admissionSteps = {
  kcet: [
    'Register for KCET on the official KEA website.',
    'Fill out the application form and upload required documents.',
    'Download the admit card and appear for the KCET exam.',
    'Check your results and participate in the counseling process.',
    'Select your preferred engineering college and branch during counseling.',
    'Complete admission formalities at the allotted college.'
  ],
  comedk: [
    'Register for COMEDK UGET on the official COMEDK website.',
    'Fill out the application form and upload required documents.',
    'Download the admit card and appear for the COMEDK UGET exam.',
    'Check your results and participate in the counseling process.',
    'Choose your preferred engineering college and branch during counseling.',
    'Complete admission formalities at the allotted college.'
  ],
  management: [
    'Contact the engineering college directly for management quota admission.',
    'Submit the application form and required documents to the college.',
    'Attend any interviews or discussions as required by the college.',
    'Receive the admission offer from the college.',
    'Pay the admission fees and complete the formalities.'
  ]
};

const Card = ({ title, steps }: { title: string; steps: string[] }) => (
  <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 rounded-2xl shadow-xl border-2 border-blue-900 p-8 w-full max-w-md mx-auto">
    <h2 className="text-2xl font-bold text-gradient mb-4 text-center">{title}</h2>
    <ol className="list-decimal list-inside text-gray-200 space-y-2">
      {steps.map((step, idx) => (
        <li key={idx}>{step}</li>
      ))}
    </ol>
  </div>
);

const AdmissionPage: React.FC = () => (
  <Layout>
    <div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 px-4 md:px-8 mt-8">
      <div className="w-full flex flex-col items-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gradient mb-6 drop-shadow-lg leading-tight md:leading-[1.15] pb-2 text-center">
          Engineering Admission Guide
        </h1>
        <p className="text-lg text-gray-200 text-center max-w-2xl">
          Step-by-step details for joining engineering through KCET, COMEDK, and Management quota.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        <Card title="KCET Admission" steps={admissionSteps.kcet} />
        <Card title="COMEDK Admission" steps={admissionSteps.comedk} />
        <Card title="Management Quota" steps={admissionSteps.management} />
      </div>
    </div>
  </Layout>
);

export default AdmissionPage;
