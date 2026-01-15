import React, { useState } from 'react';
import { MoreVertical, TrendingUp, FolderKanban, Wallet, UserPlus } from 'lucide-react';
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart
} from 'recharts';

// Circular Progress Component
const CircularProgress = ({ percentage, color }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <svg className="w-12 h-12 transform -rotate-90">
            <circle cx="24" cy="24" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="4" />
            <circle
                cx="24" cy="24" r={radius}
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
            />
        </svg>
    );
};

// Stat Card Component with Gradient Backgrounds
const StatCard = ({ title, value, change, changeType, percentage, color, gradient, icon: Icon }) => (
    <div className={`group relative rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${gradient}`}>
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full"></div>

        <div className="relative flex items-start justify-between">
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                    {Icon && <Icon size={18} className="text-white/80" />}
                    <p className="text-xs text-white/80 font-bold uppercase tracking-wider">{title}</p>
                </div>
                <p className="text-3xl font-bold text-white mb-4">{value}</p>
                <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm ${changeType === 'up' ? 'bg-white/20 text-white' : 'bg-black/20 text-white'}`}>
                        {changeType === 'up' ? '↑' : '↓'} {change}
                    </span>
                    <span className="text-xs text-white/70 font-medium">From last Week</span>
                </div>
            </div>
            <div className="relative flex items-center justify-center">
                <CircularProgress percentage={percentage} color="rgba(255,255,255,0.9)" />
                <span className="absolute text-sm font-bold text-white">{percentage}%</span>
            </div>
        </div>
    </div>
);

// Custom Tooltip Component with Orange Accent
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 shadow-2xl rounded-xl px-4 py-3 border border-orange-500/30">
                <p className="text-xs text-orange-400 mb-2 font-bold uppercase tracking-wide">{label}</p>
                <div className="flex items-center space-x-2 mb-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-bold text-white">
                        PKR {payload[0]?.value?.toLocaleString()}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                    <span className="text-sm font-bold text-white">
                        PKR {payload[1]?.value?.toLocaleString()}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

// VIP Dynamic Line Chart Component using Recharts with Orange Theme
const LineChart = () => {
    const data = [
        { day: 'Mon', profit: 35000, expenses: 28000 },
        { day: 'Tue', profit: 32000, expenses: 25000 },
        { day: 'Wed', profit: 48000, expenses: 35000 },
        { day: 'Thu', profit: 95000, expenses: 42000 },
        { day: 'Fri', profit: 68000, expenses: 55000 },
        { day: 'Sat', profit: 85000, expenses: 48000 },
        { day: 'Sun', profit: 60000, expenses: 38000 },
    ];

    return (
        <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
                <ComposedChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 10 }}>
                    <defs>
                        <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 600 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                        tickFormatter={(value) => `${value / 1000}k`}
                        domain={[20000, 100000]}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f97316', strokeWidth: 2, strokeDasharray: '5 5' }} />

                    {/* Area fills */}
                    <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="none"
                        fill="url(#profitGradient)"
                    />
                    <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="none"
                        fill="url(#expenseGradient)"
                    />

                    {/* Lines */}
                    <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 7, fill: '#10b981', stroke: 'white', strokeWidth: 3 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 7, fill: '#f97316', stroke: 'white', strokeWidth: 3 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

const Dashboard = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Dashboard</h1>
                <div className="flex bg-gray-100 rounded-xl p-1.5 shadow-sm">
                    <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl">Weekly</button>
                    <button className="px-6 py-2.5 text-gray-600 text-sm font-medium hover:bg-white rounded-lg transition-all">Monthly</button>
                    <button className="px-6 py-2.5 text-gray-600 text-sm font-medium hover:bg-white rounded-lg transition-all">Yearly</button>
                </div>
            </div>

            {/* Stats Cards with Vibrant Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Total Profit"
                    value="PKR 25,127"
                    change="75%"
                    changeType="up"
                    percentage={75}
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                    icon={TrendingUp}
                />
                <StatCard
                    title="Total Projects"
                    value="520"
                    change="32%"
                    changeType="up"
                    percentage={60}
                    gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    icon={FolderKanban}
                />
                <StatCard
                    title="Total Expenses"
                    value="PKR 12,120"
                    change="60%"
                    changeType="down"
                    percentage={45}
                    gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
                    icon={Wallet}
                />
                <StatCard
                    title="New Customer"
                    value="124"
                    change="5%"
                    changeType="up"
                    percentage={30}
                    gradient="bg-gradient-to-br from-pink-500 to-pink-600"
                    icon={UserPlus}
                />
            </div>

            {/* Main Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overview Chart with Enhanced Design */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Overview</h2>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-sm font-semibold text-gray-600">Profit</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span className="text-sm font-semibold text-gray-600">Expenses</span>
                            </div>
                            <button className="text-gray-400 hover:text-orange-600 transition-colors">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>
                    <LineChart />
                </div>

                {/* Top Customers with Colorful Avatars */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Top Customer</h2>
                        <button className="text-gray-400 hover:text-orange-600 transition-colors">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Benny Chagurian', role: 'CEO of Tech Innovations', gradient: 'from-orange-400 to-orange-600', initials: 'BC' },
                            { name: 'Chynita Hereen', role: 'Marketing Director', gradient: 'from-pink-400 to-pink-600', initials: 'CH' },
                            { name: 'David Yersh', role: 'Loyal Customer', gradient: 'from-cyan-400 to-cyan-600', initials: 'DY' },
                            { name: 'Hayder Jahan', role: 'Project Manager', gradient: 'from-purple-400 to-purple-600', initials: 'HJ' },
                        ].map((customer, i) => (
                            <div key={i} className="group flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${customer.gradient} rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                                    <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${customer.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                                        {customer.initials}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800">{customer.name}</p>
                                    <p className="text-xs text-gray-500 font-medium">{customer.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Invoice Table with Modern Design */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-xl font-bold text-gray-900">Invoice</h2>
                    <button className="text-gray-400 hover:text-orange-600 transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 font-semibold text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { location: 'Cedar Grove Lane', role: 'Technical Lead', date: 'December 5th, 2025', name: 'David Lane', status: 'Finished', amount: 'PKR 315.00' },
                                { location: 'Riverbend Plaza', role: 'Sales Manager', date: 'October 22nd, 2025', name: 'Mark Johnson', status: 'Pending', amount: 'PKR 210.00' },
                                { location: 'Sunnyvale Park', role: 'Customer Support', date: 'September 15th, 2025', name: 'Hassan Ali', status: 'Finished', amount: 'PKR 260.00' },
                                { location: 'Maplewood Avenue', role: 'Product Owner', date: 'November 30th, 2025', name: 'David Lane', status: 'Cancel', amount: 'PKR 410.00' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-orange-50/30 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-gray-800">{row.location}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{row.role}</td>
                                    <td className="px-6 py-4 text-gray-500">{row.date}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{row.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${row.status === 'Finished' ? 'bg-emerald-100 text-emerald-700' :
                                            row.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Finished' ? 'bg-emerald-500' :
                                                row.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'
                                                }`}></span>
                                            <span>{row.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{row.amount}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-gray-400 hover:text-orange-600 font-bold transition-colors">•••</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
