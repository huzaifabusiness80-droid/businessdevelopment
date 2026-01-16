import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', sales: 190000, revenue: 90000 },
    { name: 'Feb', sales: 240000, revenue: 110000 },
    { name: 'Mar', sales: 140000, revenue: 140000 },
    { name: 'Apr', sales: 280000, revenue: 190000 },
    { name: 'May', sales: 310000, revenue: 210000 },
    { name: 'Jun', sales: 300000, revenue: 350000 },
];

const SalesChart = () => {
    return (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Financial Magnitude</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Operational sales vs revenue performance audit</p>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gross Sales</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Net Revenue</span>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={12} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            tickFormatter={(value) => `${value / 1000}K`}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                            itemStyle={{
                                fontSize: '10px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                            labelStyle={{
                                fontSize: '10px',
                                color: '#94a3b8',
                                marginBottom: '4px',
                                textTransform: 'uppercase',
                                fontWeight: 'bold'
                            }}
                        />
                        <Bar dataKey="sales" fill="#2563eb" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="revenue" fill="#94a3b8" radius={[2, 2, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesChart;
