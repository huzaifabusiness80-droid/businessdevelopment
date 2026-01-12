import React from 'react';
import { ShoppingCart, Users, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
import StatsCard from './StatsCard';
import SalesChart from './SalesChart';

const Dashboard = () => {
    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Sales"
                    value="1,250"
                    subtext="Today: 45"
                    icon={ShoppingCart}
                    color="blue"
                />
                <StatsCard
                    title="Total Customers"
                    value="320"
                    subtext="New: 12"
                    icon={Users}
                    color="green"
                />
                <StatsCard
                    title="Today's Revenue"
                    value="PKR 85,000"
                    subtext="Yesterday: 75k"
                    icon={DollarSign}
                    color="orange"
                />
                <StatsCard
                    title="Low Stock Items"
                    value="8 Items"
                    subtext="Requires Attention"
                    icon={AlertTriangle}
                    color="red"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Sales Chart */}
                <div className="lg:col-span-2 space-y-6">
                    <SalesChart />

                    {/* Recent Sales Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">Recent Sales</h2>
                            <button className="text-sm text-primary font-semibold hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Invoice No</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { id: 'INV-1023', customer: 'Ali Traders', amount: 'PKR 15,000', date: '02/12/2022' },
                                        { id: 'INV-1022', customer: 'Kamran & Co.', amount: 'PKR 8,500', date: '02/11/2022' },
                                        { id: 'INV-1021', customer: 'Niaz Enterprises', amount: 'PKR 12,000', date: '02/10/2022' },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-800">{row.id}</td>
                                            <td className="px-6 py-4 text-gray-600">{row.customer}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-800">{row.amount}</td>
                                            <td className="px-6 py-4 text-gray-500">{row.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column - Alerts & Stats */}
                <div className="space-y-6">
                    {/* Low Stock Alerts */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Low Stock Alerts</h2>
                        <div className="space-y-4">
                            {[
                                { name: 'Product A', stock: 5 },
                                { name: 'Product B', stock: 2 },
                                { name: 'Product C', stock: 4 },
                                { name: 'Product D', stock: 3 },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                    <span className="font-medium text-gray-700">{item.name}</span>
                                    <span className="text-sm font-bold text-red-600">Stock: {item.stock}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Customer Stats</h2>
                        <div className="space-y-4">
                            <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">New Customers</p>
                                    <p className="text-lg font-bold text-gray-800">12 <span className="text-xs font-normal text-gray-500">This Month</span></p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="p-3 bg-slate-200 text-slate-700 rounded-full mr-4">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Due Balance</p>
                                    <p className="text-lg font-bold text-gray-800">PKR 30,500</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-4 py-3 bg-primary text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                            <span>View All Customers</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
