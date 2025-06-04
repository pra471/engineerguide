import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import { X } from 'lucide-react';

const AssistePage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [responses, setResponses] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const helpRequests = JSON.parse(localStorage.getItem('helpRequests') || '[]');
    setRequests(helpRequests);
    // Listen for updates to helpRequests in localStorage (for real-time updates)
    const onStorage = () => {
      const updated = JSON.parse(localStorage.getItem('helpRequests') || '[]');
      setRequests(updated);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleResponse = (id: string) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, status: 'responded', response: responses[id] } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('helpRequests', JSON.stringify(updatedRequests));
  };

  const handleCloseRequest = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
    // Do not update localStorage, so the removal is only temporary for this session
  };

  return (
    <Layout>
      <div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 rounded-none px-4 md:px-8 mt-8">
        <div className="w-full py-12 bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 rounded-2xl shadow-2xl border-2 border-pink-900 px-4 md:px-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">Assist Student Projects</h1>
          {requests.length === 0 ? (
            <div className="text-center text-gray-400">No help requests yet.</div>
          ) : (
            <div className="space-y-6 w-full">
              {requests.map(req => (
                <div key={req.id} className="bg-gray-900/80 p-6 rounded-2xl shadow-lg border border-blue-950 transition-all duration-300 relative">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 focus:outline-none"
                    title="Close request"
                    onClick={() => handleCloseRequest(req.id)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <h2 className="text-lg font-semibold mb-2 text-white">{req.title}</h2>
                  <p className="mb-2 text-gray-300">{req.details}</p>
                  {req.user && (
                    <div className="mb-2 text-xs text-gray-400">Requested by: {req.user.username} (ID: {req.user.id})</div>
                  )}
                  <div className="mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${req.status === 'responded' ? 'bg-green-800/30 text-green-300 border border-green-700' : 'bg-yellow-800/30 text-yellow-200 border border-yellow-700'}`}>{req.status}</span>
                  </div>
                  {req.status === 'responded' ? (
                    <div className="mt-2">
                      <div className="font-medium text-green-300 mb-1">Admin Response:</div>
                      <div className="text-gray-100 bg-gray-800/70 rounded-lg p-3 border border-green-800 shadow-inner">{req.response}</div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <textarea
                        className="w-full border-2 border-yellow-900 px-3 py-2 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none text-lg bg-gray-900/80 text-gray-100 shadow"
                        placeholder="Suggest resources, links, or advice..."
                        value={responses[req.id] || ''}
                        onChange={e => setResponses({ ...responses, [req.id]: e.target.value })}
                        rows={3}
                      />
                      <Button onClick={() => handleResponse(req.id)} disabled={!responses[req.id]}>Send Response</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AssistePage;
