import React, { useState } from 'react';
import Layout from '../components/common/Layout';
import { useParams } from 'react-router-dom';
import Button from '../components/common/Button';

const helpTitles = {
  ket: 'KET Admission Help Requests',
  comedk: 'COMEDK Admission Help Requests',
  management: 'Management Quota Help Requests'
};

const helpKeys = ['ket', 'comedk', 'management'] as const;
type HelpType = typeof helpKeys[number];

const getRequests = (type: HelpType) => {
  return JSON.parse(localStorage.getItem(`admissionHelpRequests_${type}`) || '[]');
};

const saveRequests = (type: HelpType, requests: any[]) => {
  localStorage.setItem(`admissionHelpRequests_${type}` , JSON.stringify(requests));
};

const AdminAdmissionHelpRequestsPage: React.FC = () => {
  const { type } = useParams<{ type: HelpType }>();
  const [requests, setRequests] = useState(() => type && helpKeys.includes(type as HelpType) ? getRequests(type as HelpType) : []);
  const [responses, setResponses] = useState<{[k:number]: string}>({});

  if (!type || !helpKeys.includes(type as HelpType)) return null;

  const handleRespond = (idx: number) => {
    const updated = [...requests];
    updated[idx].response = responses[idx] || '';
    setRequests(updated);
    saveRequests(type as HelpType, updated);
    // Save response for user to see
    setResponses(r => ({ ...r, [idx]: '' }));
  };

  return (
    <Layout>
      <div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 px-4 md:px-8 mt-8">
        <div className="w-full min-h-screen rounded-2xl bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 shadow-2xl border-2 border-blue-900 px-4 md:px-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gradient mb-8 mt-12 text-center">{helpTitles[type as HelpType]}</h1>
          <div className="w-full max-w-2xl">
            {requests.length === 0 ? (
              <div className="text-gray-300 text-center">No help requests yet.</div>
            ) : (
              <ul className="space-y-8">
                {requests.map((req: any, idx: number) => (
                  <li key={idx} className="bg-gray-900/80 border border-blue-900 rounded-xl p-6 shadow-lg">
                    <div className="mb-2 text-blue-200 font-semibold">Q: {req.question}</div>
                    <div className="mb-2 text-green-300">A: {req.response || 'No response yet.'}</div>
                    <textarea
                      className="w-full min-h-[60px] bg-gray-800 text-gray-100 rounded px-3 py-2 border border-blue-900 mb-2"
                      value={responses[idx] ?? ''}
                      onChange={e => setResponses(r => ({ ...r, [idx]: e.target.value }))}
                      placeholder="Type your response here..."
                    />
                    <Button className="bg-blue-900 text-white px-4 py-1" onClick={() => handleRespond(idx)}>
                      Send Response
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAdmissionHelpRequestsPage;
