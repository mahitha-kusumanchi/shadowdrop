import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Key, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [stage, setStage] = useState('credentials'); // credentials, mfa
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = { username, password };
            if (stage === 'mfa') payload.mfaToken = mfaToken;

            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, payload);

            // Success
            console.log("Login Successful:", res.data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);

            console.log("Navigating to /admin...");
            navigate('/admin');

        } catch (err) {
            console.error("Login Error:", err);
            if (err.response?.status === 403 && err.response?.data?.mfaRequired) {
                setStage('mfa');
            } else {
                setError(err.response?.data?.message || 'Login failed');
            }
        }
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-white/5 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Investigator Access</h2>
                    <p className="text-gray-400">Restricted area. Authorized personnel only.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {stage === 'credentials' ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4">
                            <label className="block text-sm font-medium text-primary mb-2">Two-Factor Authentication Code</label>
                            <input
                                type="text"
                                required
                                value={mfaToken}
                                onChange={e => setMfaToken(e.target.value)}
                                placeholder="000 000"
                                maxLength={6}
                                className="w-full bg-black/30 border border-primary/50 rounded-lg p-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-primary transition-colors"
                                autoFocus
                            />
                            <p className="text-xs text-center mt-2 text-gray-500">Enter the code from your authenticator app</p>
                        </div>
                    )}

                    {error && <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}

                    <button
                        type="submit"
                        className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition-all flex justify-center items-center gap-2"
                    >
                        {stage === 'credentials' ? <Lock className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                        {stage === 'credentials' ? 'Authenticate' : 'Verify Identity'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
