import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

interface HelpRequest {
  id: string;
  title: string;
  details: string;
  user: { id: string; username: string };
  status: string;
  response: string;
}

const HelpPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [userRequests, setUserRequests] = useState<HelpRequest[]>([]);
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !details.trim()) {
      setError('Please fill in all fields');
      return;
    }
    const helpRequests: HelpRequest[] = JSON.parse(localStorage.getItem('helpRequests') || '[]');
    const newRequest: HelpRequest = {
      id: Date.now().toString(),
      title,
      details,
      user: user ? { id: user.id, username: user.username } : { id: '', username: '' },
      status: 'pending',
      response: '',
    };
    helpRequests.push(newRequest);
    localStorage.setItem('helpRequests', JSON.stringify(helpRequests));
    setSuccess(true);
    setTitle('');
    setDetails('');
    setUserRequests(helpRequests.filter((req) => req.user && req.user.id === user?.id));
  };

  useEffect(() => {
    const helpRequests: HelpRequest[] = JSON.parse(localStorage.getItem('helpRequests') || '[]');
    if (user) {
      setUserRequests(helpRequests.filter((req) => req.user && req.user.id === user.id));
    }
  }, [user]);

  return (
    <Layout>
      <div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 rounded-none px-4 md:px-8 mt-8">
        <div className="w-full py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-950 rounded-2xl px-4 md:px-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">Request Project Help</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800/90 p-8 rounded-2xl shadow-xl border border-pink-900 w-full max-w-none">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-100">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border-2 border-blue-900 px-3 py-2 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none text-lg bg-gray-900/80 text-gray-100 shadow"
                placeholder="Enter your project title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-100">Project Details</label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                className="w-full border-2 border-pink-900 px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg bg-gray-900/80 text-gray-100 shadow"
                placeholder="Describe your project and what help you need"
                rows={5}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">Request submitted! An admin will assist you soon.</div>}
            <Button type="submit" fullWidth>Submit Request</Button>
          </form>
          {userRequests.length > 0 && (
            <div className="mt-10 w-full">
              <h2 className="text-lg font-semibold mb-4 text-gray-100">Your Previous Requests</h2>
              <div className="space-y-4 w-full">
                {userRequests.map(req => (
                  <div key={req.id} className="bg-gray-800 p-4 rounded border border-gray-700">
                    <div className="font-medium text-gray-100">{req.title}</div>
                    <div className="text-sm text-gray-300 mb-1">{req.details}</div>
                    <div className="text-xs mb-1">Status: <span className={req.status === 'responded' ? 'text-green-400' : 'text-yellow-300'}>{req.status}</span></div>
                    {req.status === 'responded' && (
                      <div className="mt-1 text-green-400">
                        <span className="font-semibold">Admin Response:</span> {req.response}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HelpPage;
