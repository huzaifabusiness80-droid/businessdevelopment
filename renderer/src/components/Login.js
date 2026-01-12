import React, { useState } from 'react';
import { User, Lock, LayoutDashboard } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;

            // Check if running in Electron or Browser
            if (window.electronAPI) {
                // Call the exposed Electron API for login
                result = await window.electronAPI.loginUser({ username, password });
            } else {
                // Mock login for browser development
                console.warn('Electron API not found. Using mock login.');
                await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

                if (username === 'admin' && password === 'admin') {
                    result = {
                        success: true,
                        user: {
                            id: 1,
                            username: 'admin',
                            fullname: 'Administrator',
                            role: 'admin',
                            company_id: 1
                        }
                    };
                } else if (username && password) {
                    // Generic mock user for other credentials
                    result = {
                        success: true,
                        user: {
                            id: 999,
                            username: username,
                            fullname: 'Test User',
                            role: 'manager',
                            company_id: 1
                        }
                    };
                } else {
                    result = { success: false, message: 'Invalid credentials' };
                }
            }

            if (result.success) {
                onLoginSuccess(result.user, result.permissions || []);
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error('Login error:', err);
            // Show the actual error message to help debugging
            setError(`Login failed: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-8 text-center bg-slate-800 text-white">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                        <LayoutDashboard size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-slate-400 mt-2">Sign in to Business Management System</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100 mb-4 transition-all">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Signing In...</span>
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
