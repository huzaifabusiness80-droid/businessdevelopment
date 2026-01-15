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
        <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-300 to-blue-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-300 to-purple-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="p-10 text-center relative">
                        {/* Logo with Gradient */}
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl blur-lg opacity-40"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <LayoutDashboard size={40} className="text-white" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">
                            Sign in to your Business Management System
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="px-10 pb-10">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 shadow-sm animate-shake">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                </div>
                            )}

                            {/* Username Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-10 blur transition-all duration-300"></div>
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-all duration-300 z-10" size={20} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="relative w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-400"
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-10 blur transition-all duration-300"></div>
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-all duration-300 z-10" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="relative w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition-all duration-300 placeholder:text-gray-400"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`relative w-full py-4 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group overflow-hidden ${loading ? 'opacity-70 cursor-not-allowed' : 'transform hover:scale-[1.02]'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10">
                                    {loading ? (
                                        <span className="flex items-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Signing In...</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center space-x-2">
                                            <span>Sign In</span>
                                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                    )}
                                </span>
                            </button>
                        </form>

                        {/* Footer Text */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-400">
                                Secured by advanced encryption
                            </p>
                        </div>
                    </div>
                </div>

                {/* Floating Decorative Elements */}
                <div className="absolute -z-10 top-10 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl opacity-20 blur-xl animate-pulse"></div>
                <div className="absolute -z-10 bottom-10 -left-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl opacity-20 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
        </div>
    );
};

export default Login;
