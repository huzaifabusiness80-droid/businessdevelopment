import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
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

// Stat Card Component
const StatCard = ({ title, value, change, changeType, percentage, color }) => (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs text-gray-400 mb-1">{title}</p>
                <p className="text-xl font-bold text-gray-800">{value}</p>
                <div className="flex items-center mt-2 space-x-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${changeType === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                        {changeType === 'up' ? '+' : '-'}{change}
                    </span>
                    <span className="text-xs text-gray-400">From last Week</span>
                </div>
            </div>
            <CircularProgress percentage={percentage} color={color} />
        </div>
    </div>
);

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white shadow-xl rounded-xl px-4 py-3 border border-gray-100">
                <p className="text-xs text-gray-500 mb-2 font-medium">{label}</p>
                <div className="flex items-center space-x-2 mb-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-semibold text-gray-800">
                        PKR {payload[0]?.value?.toLocaleString()}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>
                    <span className="text-sm font-semibold text-gray-800">
                        PKR {payload[1]?.value?.toLocaleString()}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

// VIP Dynamic Line Chart Component using Recharts
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
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <ComposedChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 10 }}>
                    <defs>
                        <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        tickFormatter={(value) => `${value / 1000}k`}
                        domain={[20000, 100000]}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeDasharray: '5 5' }} />

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
                        activeDot={{ r: 6, fill: '#10b981', stroke: 'white', strokeWidth: 3 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: '#8b5cf6', stroke: 'white', strokeWidth: 3 }}
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
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="flex bg-gray-100 rounded-xl p-1">
                    <button className="px-5 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium shadow-sm">Weekly</button>
                    <button className="px-5 py-2 text-gray-500 text-sm font-medium hover:bg-white rounded-lg transition-colors">Monthly</button>
                    <button className="px-5 py-2 text-gray-500 text-sm font-medium hover:bg-white rounded-lg transition-colors">Yearly</button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard title="Total Profit" value="PKR 25,127.00" change="75%" changeType="up" percentage={75} color="#3b82f6" />
                <StatCard title="Total Projects" value="520" change="32%" changeType="up" percentage={60} color="#10b981" />
                <StatCard title="Total Expenses" value="PKR 12,120.00" change="60%" changeType="down" percentage={45} color="#8b5cf6" />
                <StatCard title="New Customer" value="124" change="5%" changeType="up" percentage={30} color="#f97316" />
            </div>

            {/* Main Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overview Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-gray-800">Overview</h2>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                <span className="text-sm text-gray-500">Profit</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                                <span className="text-sm text-gray-500">Expenses</span>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>
                    <LineChart />
                </div>

                {/* Top Customers */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-gray-800">Top Customer</h2>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                    <div className="space-y-5">
                        {[
                            { name: 'Benny Chagurian', role: 'CEO of Tech Innovations', color: 'from-amber-400 to-orange-500' },
                            { name: 'Chynita Hereen', role: 'Marketing Director', color: 'from-pink-400 to-rose-500' },
                            { name: 'David Yersh', role: 'Loyal Customer', color: 'from-cyan-400 to-blue-500' },
                            { name: 'Hayder Jahan', role: 'Project Manager', color: 'from-violet-400 to-purple-500' },
                        ].map((customer, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${customer.color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">{customer.name}</p>
                                    <p className="text-xs text-gray-400">{customer.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Invoice Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Invoice</h2>
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-400 font-medium text-xs uppercase">
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
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-700">{row.location}</td>
                                    <td className="px-6 py-4 text-gray-500">{row.role}</td>
                                    <td className="px-6 py-4 text-gray-500">{row.date}</td>
                                    <td className="px-6 py-4 text-gray-700">{row.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center space-x-1.5 text-xs font-medium ${row.status === 'Finished' ? 'text-emerald-600' :
                                            row.status === 'Pending' ? 'text-orange-500' : 'text-red-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Finished' ? 'bg-emerald-500' :
                                                row.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'
                                                }`}></span>
                                            <span>{row.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-700">{row.amount}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-gray-400 hover:text-gray-600">•••</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
