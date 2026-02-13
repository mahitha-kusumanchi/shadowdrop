import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { generateAESKey, generateIV, encryptData, encryptKey } from '../utils/crypto';

// Public key is fetched dynamically from /api/config/public-key

const SubmitReport = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('idle'); // idle, encrypting, sending, success, error
    const [reportId, setReportId] = useState(null);
    const [serverKey, setServerKey] = useState(null);

    useEffect(() => {
        // Fetch public key from server
        axios.get('http://localhost:5000/api/config/public-key')
            .then(res => setServerKey(res.data.publicKey))
            .catch(err => console.error("Failed to fetch public key", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!serverKey) {
                alert("Server Public Key not found. Cannot encrypt. Please ensure server is running and refresh.");
                return;
            }

            setStatus('encrypting');

            // 1. Generate Session Key (AES)
            const aesKey = generateAESKey();
            const iv = generateIV();
            // generateIV returns a binary string. Convert to base64 for transport to server.
            const ivBase64 = window.btoa(iv);

            // 2. Encrypt Data
            const payload = { title, description, timestamp: Date.now() };
            // encryptData returns base64 string
            const encryptedData = encryptData(payload, aesKey, iv);

            // 3. Encrypt Session Key with RSA Public Key
            const encryptedKey = encryptKey(aesKey, serverKey);

            setStatus('sending');

            // 4. Send to Server
            const res = await axios.post('http://localhost:5000/api/reports', {
                encryptedData,
                encryptedKey,
                iv: ivBase64
            });

            setReportId(res.data.reportId);
            setStatus('success');
            setTitle('');
            setDescription('');

        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface p-8 rounded-2xl border border-white/5 shadow-2xl"
            >
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <Lock className="w-8 h-8 text-primary" />
                    <h2 className="text-2xl font-bold">Secure Submission</h2>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-10">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Report Submitted Encrypted</h3>
                        <p className="text-gray-400 mb-6">Your Report ID is:</p>
                        <code className="bg-black/50 p-3 rounded text-primary text-xl font-mono block mb-6">{reportId}</code>
                        <p className="text-sm text-gray-500">Keep this ID safe. It is the only way to track your report.</p>
                        <button onClick={() => setStatus('idle')} className="mt-8 text-primary hover:underline">Submit Another</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Title / Subject</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="e.g., Unsafe working conditions"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Detailed Description</label>
                            <textarea
                                required
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={6}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Describe the incident..."
                            />
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex gap-3 text-sm text-blue-200">
                            <Lock className="w-5 h-5 flex-shrink-0" />
                            <p>This content will be encrypted with AES-256-GCM in your browser. The server will only see ciphertext. Only an Administrator with the Private Key can decrypt this.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'encrypting' || status === 'sending'}
                            className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'encrypting' ? 'Encrypting...' : status === 'sending' ? 'Sending...' : (
                                <>
                                    <Send className="w-5 h-5" /> Submit Securely
                                </>
                            )}
                        </button>

                        {status === 'error' && (
                            <div className="text-red-400 text-center flex items-center justify-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Submission failed. Please try again.
                            </div>
                        )}
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default SubmitReport;
