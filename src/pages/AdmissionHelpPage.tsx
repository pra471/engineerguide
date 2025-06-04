import React, { useState } from 'react';
import Layout from '../components/common/Layout';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const helpTitles = {
  ket: 'KET Admission Help',
  comedk: 'COMEDK Admission Help',
  management: 'Management Quota Help'
};

const helpKeys = ['ket', 'comedk', 'management'] as const;
type HelpType = typeof helpKeys[number];

const getHelpText = (type: HelpType) => {
  return localStorage.getItem(`admissionHelp_${type}`) || '';
};

const saveHelpRequest = (type: HelpType, question: string) => {
  const key = `admissionHelpRequests_${type}`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push({ question, response: '' });
  localStorage.setItem(key, JSON.stringify(existing));
};

const getHelpRequests = (type: string) => {
  return JSON.parse(localStorage.getItem(`admissionHelpRequests_${type}`) || '[]');
};

const saveHelpRequests = (type: string, requests: any[]) => {
  localStorage.setItem(`admissionHelpRequests_${type}`, JSON.stringify(requests));
};

const getHelpResponse = (type: string, idx: number) => {
  const requests = getHelpRequests(type);
  return requests[idx]?.response || '';
};

const getUserHelpHistory = (type: string) => {
  // Save per user in localStorage, fallback to all if not implemented
  return JSON.parse(localStorage.getItem(`admissionUserHelpHistory_${type}`) || '[]');
};

const saveUserHelpHistory = (type: string, history: any[]) => {
  localStorage.setItem(`admissionUserHelpHistory_${type}`, JSON.stringify(history));
};

const AdmissionHelpPage: React.FC = () => {
  const { type } = useParams<{ type: HelpType }>();
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [adminAnswered, setAdminAnswered] = useState<string>('');
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const [userRequestIdx, setUserRequestIdx] = useState<number | null>(null);
  const [userHistory, setUserHistory] = useState<any[]>(() => getUserHelpHistory(type!));
  if (!type || !helpKeys.includes(type as HelpType)) return null;
  const helpText = getHelpText(type as HelpType);

  React.useEffect(() => {
    if (type) {
      const reqs = getHelpRequests(type);
      setUserRequests(reqs);
      if (submitted) {
        setUserRequestIdx(reqs.length - 1);
      }
    }
  }, [type, submitted]);

  React.useEffect(() => {
    // Poll for admin response to the user's own request
    if (type && userRequestIdx !== null && submitted) {
      const interval = setInterval(() => {
        const reqs = getHelpRequests(type);
        setUserRequests(reqs);
        const req = reqs[userRequestIdx];
        if (req && req.response && !adminAnswered) {
          setAdminAnswered(req.response);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [type, submitted, userRequestIdx, adminAnswered]);

  // Save user question to both admin and user history
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      saveHelpRequest(type as HelpType, question.trim());
      const updatedHistory = [...userHistory, { question: question.trim(), response: '' }];
      saveUserHelpHistory(type!, updatedHistory);
      setUserHistory(updatedHistory);
      setSubmitted(true);
      setQuestion('');
      setUserRequestIdx(updatedHistory.length - 1);
    }
  };

  // Poll for admin response and update user history
  React.useEffect(() => {
    if (type && userHistory.length > 0) {
      const interval = setInterval(() => {
        const adminRequests = getHelpRequests(type);
        let updated = false;
        const newHistory = userHistory.map((item, idx) => {
          const adminResp = adminRequests[idx]?.response || '';
          if (adminResp && item.response !== adminResp) {
            updated = true;
            return { ...item, response: adminResp };
          }
          return item;
        });
        if (updated) {
          setUserHistory(newHistory);
          saveUserHelpHistory(type, newHistory);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [type, userHistory]);

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
            {helpTitles[type as HelpType]}
          </motion.h1>
          <div className="bg-gray-900/80 border border-blue-900 rounded-xl p-6 max-w-2xl w-full text-gray-200 text-lg shadow-lg mb-8">
            {helpText ? helpText : 'No help or guidance has been provided yet.'}
          </div>
          <div className="bg-gray-900/80 border border-blue-900 rounded-xl p-6 max-w-2xl w-full text-gray-200 text-lg shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-2">Your Previous Help Requests</h2>
            {userHistory.length === 0 ? (
              <div className="text-gray-400">No previous help requests.</div>
            ) : (
              <ul className="space-y-4">
                {userHistory.map((item, idx) => (
                  <li key={idx} className="bg-gray-800/80 rounded p-4 border border-blue-900">
                    <div className="mb-1"><span className="font-semibold text-blue-300">Q:</span> {item.question}</div>
                    <div><span className="font-semibold text-green-300">A:</span> {item.response ? item.response : <span className="text-gray-400">No response yet.</span>}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-gray-900/80 border border-blue-900 rounded-xl p-6 max-w-2xl w-full text-gray-200 text-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Ask a Question</h2>
            {submitted ? (
              <div>
                <div className="text-green-400 mb-2">Your question has been submitted. An admin will respond soon.</div>
                {adminAnswered && (
                  <div className="text-blue-400 mt-4">Admin Response: {adminAnswered}</div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <textarea
                  className="w-full min-h-[60px] bg-gray-800 text-gray-100 rounded px-3 py-2 border border-blue-900 mb-2"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  required
                />
                <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded shadow">Submit</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdmissionHelpPage;
