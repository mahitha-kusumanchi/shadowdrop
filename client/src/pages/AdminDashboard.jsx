import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Unlock,
    FileText,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    UserPlus,
    Shield,
    LogOut,
    Plus,
    Key,
    Lock,
    Trash2
} from 'lucide-react';
import { decryptData, decryptKey } from '../utils/crypto';

const SetupMFA = () => {
    const [qrCode, setQrCode] = useState('');
    const [token, setToken] = useState('');
    const [status, setStatus] = useState('idle');

    const startSetup = async () => {
        try {
            const authToken = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/mfa/setup`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setQrCode(res.data.qrCode);
            setStatus('scanning');
        } catch (err) { alert('MFA Setup Failed'); }
    };

    const verifyMFA = async () => {
        try {
            const authToken = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/mfa/verify`, { token }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) { alert('Invalid Token'); }
    };

    if (status === 'success') return (
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-500 flex items-center gap-3 mb-8">
            <CheckCircle className="w-5 h-5" /> MFA Setup Complete!
        </div>
    );

    return (
        <div className="bg-surface p-6 rounded-xl border border-white/5 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                <Shield className="w-6 h-6" /> Two-Factor Authentication
            </h2>
            {status === 'idle' ? (
                <button onClick={startSetup} className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Setup 2FA Now
                </button>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-gray-400">Scan this QR code:</p>
                    <img src={qrCode} alt="QR Code" className="w-48 h-48 rounded-lg border-4 border-white" />
                    <div className="flex gap-2">
                        <input
                            placeholder="6-digit code"
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-primary text-sm"
                        />
                        <button onClick={verifyMFA} className="bg-primary text-black font-bold px-4 py-2 rounded hover:bg-primary/80 transition-all">Verify</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const CreateUserForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'Investigator' });
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // Trim username to prevent duplicates with spaces
            const trimmedData = {
                ...formData,
                username: formData.username.trim()
            };

            if (!trimmedData.username) {
                alert("Username cannot be empty");
                return;
            }

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, trimmedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("User created!");
            setFormData({ username: '', password: '', role: 'Investigator' });
            if (onSuccess) onSuccess(); // refresh user list
        } catch (err) { alert(err.response?.data?.message || "Failed"); }
    };
    return (
        <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input placeholder="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="bg-black/40 border border-white/10 p-2 rounded outline-none" />
                <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="bg-black/40 border border-white/10 p-2 rounded outline-none" />
                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="bg-black/40 border border-white/10 p-2 rounded outline-none">
                    <option value="Investigator">Investigator</option>
                    <option value="Auditor">Auditor</option>
                </select>
            </div>
            <button className="bg-primary text-black font-bold px-6 py-2 rounded-lg hover:bg-primary/90">Create Account</button>
        </form>
    );
};

const AdminDashboard = () => {
    const [reports, setReports] = useState([]);
    const [decryptedReports, setDecryptedReports] = useState({});
    const [privateKey, setPrivateKey] = useState('');
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('reports'); // 'security', 'users', 'reports'

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserRole(payload.role);
            if (payload.role === 'SuperAdmin') fetchUsers();
        } catch (e) { }
        fetchReports();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllUsers(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(res.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 401 || err.response?.status === 403) window.location.href = '/login';
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReports();
        } catch (err) { alert("Update failed"); }
    };

    const handleDecrypt = (report) => {
        if (!privateKey) return alert("Paste Private Key first!");
        try {
            const aesKey = decryptKey(report.encryptedKey, privateKey);
            const content = decryptData(report.encryptedData, aesKey, report.iv);
            setDecryptedReports(prev => ({ ...prev, [report.reportId]: content }));
        } catch (err) {
            console.error('Decryption error:', err);
            alert("Decryption failed! " + err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
    };

    const handleDeleteUser = async (userId, username) => {
        if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('User deleted successfully!');
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary" /> Investigator Dashboard
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400">Role: {userRole}</span>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1.5 rounded transition-all">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 border-b border-white/10 pb-2">
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'reports'
                        ? 'bg-primary/10 text-primary border-b-2 border-primary'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <FileText className="w-4 h-4" /> Reports
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'security'
                        ? 'bg-primary/10 text-primary border-b-2 border-primary'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Shield className="w-4 h-4" /> Security
                </button>
                {userRole === 'SuperAdmin' && (
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'users'
                            ? 'bg-primary/10 text-primary border-b-2 border-primary'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <UserPlus className="w-4 h-4" /> User Management
                    </button>
                )}
            </div>

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div className="space-y-8">
                    <SetupMFA />

                    <div className="bg-surface p-6 rounded-xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-secondary">
                            <Key className="w-6 h-6" /> Decryption Key
                        </h2>
                        <p className="text-sm text-gray-400 mb-4">Paste your RSA private key below to decrypt report contents.</p>
                        <textarea
                            value={privateKey}
                            onChange={e => setPrivateKey(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-4 font-mono text-xs text-gray-400 h-32 outline-none focus:border-secondary transition-all"
                            placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                        />
                    </div>
                </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && userRole === 'SuperAdmin' && (
                <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Investigation Map */}
                        <div className="bg-surface p-6 rounded-xl border border-white/5">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                                <FileText className="w-6 h-6" /> Investigation Overview
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between p-3 bg-black/30 rounded border border-white/5">
                                    <span className="text-gray-400">Total Reports</span>
                                    <span className="font-bold">{reports.length}</span>
                                </div>
                                <div className="flex justify-between p-3 bg-black/30 rounded border border-white/5 text-yellow-500/80">
                                    <span className="text-gray-400">Pending Reports</span>
                                    <span className="font-bold">{reports.filter(r => r.status === 'pending').length}</span>
                                </div>
                                <div className="flex justify-between p-3 bg-black/30 rounded border border-white/5 text-blue-500/80">
                                    <span className="text-gray-400">Total Users</span>
                                    <span className="font-bold">{allUsers.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* User Directory */}
                        <div className="bg-surface p-6 rounded-xl border border-white/5">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-secondary">
                                <UserPlus className="w-6 h-6" /> User Directory
                            </h2>
                            <div className="max-h-[280px] overflow-y-auto space-y-2 pr-2">
                                {allUsers.map(u => (
                                    <div key={u.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10 shadow-sm transition-all hover:bg-black/30">
                                        <div>
                                            <p className="font-bold text-sm">{u.username}</p>
                                            <p className="text-[10px] text-gray-500 uppercase">{u.role}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] text-gray-600">MFA</span>
                                                <span className={`w-2 h-2 rounded-full ${u.mfaEnabled ? 'bg-green-500' : 'bg-red-900/50'}`}></span>
                                            </div>
                                            {/* Only show delete button for non-SuperAdmin users */}
                                            {u.role !== 'SuperAdmin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(u.id, u.username)}
                                                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Create User Form */}
                    <div className="bg-surface p-6 rounded-xl border border-white/5">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                            <Plus className="w-6 h-6" /> Create New Account
                        </h2>
                        <CreateUserForm onSuccess={fetchUsers} />
                    </div>
                </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FileText className="w-6 h-6 text-primary" /> All Reports
                        </h2>
                        <div className="text-sm text-gray-400">
                            Total: <span className="font-bold text-white">{reports.length}</span> |
                            Pending: <span className="font-bold text-yellow-500">{reports.filter(r => r.status === 'pending').length}</span>
                        </div>
                    </div>

                    {!privateKey && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-500 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm">Add your decryption key in the <button onClick={() => setActiveTab('security')} className="underline font-bold">Security tab</button> to view report contents.</span>
                        </div>
                    )}

                    {reports.map(report => (
                        <div key={report.id} className="bg-surface border border-white/10 p-6 rounded-xl relative overflow-hidden group hover:border-white/20 transition-all">
                            <div className="flex flex-wrap justify-between gap-4 mb-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded border border-white/5 text-gray-400">ID: {report.reportId}</span>
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${report.status === 'pending' ? 'border-yellow-500/50 text-yellow-500' :
                                        report.status === 'investigating' ? 'border-blue-500/50 text-blue-500' :
                                            'border-green-500/50 text-green-500'
                                        }`}>
                                        {report.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {userRole === 'SuperAdmin' && (
                                        <button onClick={async () => {
                                            if (confirm("Delete this report?")) {
                                                const token = localStorage.getItem('token');
                                                await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/${report.id}`, {
                                                    headers: { Authorization: `Bearer ${token}` }
                                                });
                                                fetchReports();
                                            }
                                        }} className="text-red-500 p-2 hover:bg-red-500/10 rounded transition-all">
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                    <select
                                        className="bg-black/50 border border-white/10 text-xs px-3 py-1.5 rounded"
                                        value={report.status}
                                        onChange={(e) => handleUpdateStatus(report.id, e.target.value)}
                                        disabled={userRole === 'Auditor'}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="investigating">Investigating</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-black/40 rounded-lg border border-white/5 min-h-[60px]">
                                {decryptedReports[report.reportId] ? (
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{JSON.stringify(decryptedReports[report.reportId], null, 2)}</p>
                                ) : (
                                    <div className="flex flex-col items-center py-4 text-gray-600">
                                        <Lock className="w-6 h-6 mb-2 opacity-20" />
                                        <button onClick={() => handleDecrypt(report)} className="text-xs underline hover:text-secondary opacity-50">
                                            {privateKey ? 'Click to Decrypt Content' : 'Add decryption key first'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            {report.signedBy && (
                                <div className="mt-3 flex items-center gap-2 text-[9px] uppercase tracking-wider text-green-500/60 font-bold">
                                    <Shield className="w-3 h-3" /> Signed by {report.signedBy}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
