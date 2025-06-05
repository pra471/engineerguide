import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebaseConfig';
import { confirmPasswordReset } from 'firebase/auth';

const AuthCallbackPage: React.FC = () => {
  const [mode, setMode] = useState<'processing' | 'reset' | 'done' | 'error'>('processing');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [oobCode, setOobCode] = useState('');

  useEffect(() => {
    // Firebase sends oobCode in query string for password reset
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    const oob = params.get('oobCode');
    if (modeParam === 'resetPassword' && oob) {
      setOobCode(oob);
      setMode('reset');
    } else {
      setMode('processing');
      setTimeout(() => setMode('done'), 2000);
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess('Password updated! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (mode === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900">
        <div className="bg-white rounded-lg shadow-md p-8 min-w-[320px] text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Reset Password</h2>
          {success ? (
            <div className="text-green-600 mb-4">{success}</div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <input
                type="password"
                placeholder="New password"
                className="w-full px-3 py-2 border rounded"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-3 py-2 border rounded"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                minLength={6}
                required
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded shadow w-full">Update Password</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900">
        <div className="bg-white rounded-lg shadow-md p-8 min-w-[320px] text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Done!</h2>
          <p className="text-gray-700">You may now log in.</p>
        </div>
      </div>
    );
  }

  if (mode === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900">
        <div className="bg-white rounded-lg shadow-md p-8 min-w-[320px] text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-700">{error || 'Something went wrong.'}</p>
        </div>
      </div>
    );
  }

  // Default: processing
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
