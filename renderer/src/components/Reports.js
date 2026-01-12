import React from 'react';

const Reports = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
                <div className="flex bg-gray-100 rounded-xl p-1">
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium">Weekly</button>
                    <button className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-white rounded-lg transition-colors">Monthly</button>
                    <button className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-white rounded-lg transition-colors">Yearly</button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Total Sales</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">PKR 85,000</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Total Purchases</p>
                    <p className="text-2xl font-bold text-orange-500 mt-1">PKR 45,000</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-500 mt-1">PKR 12,000</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Net Profit</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">PKR 28,000</p>
                </div>
            </div>

            {/* Report Generator */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Generate Report</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Report Type</label>
                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100">
                            <option>Sales Report</option>
                            <option>Purchase Report</option>
                            <option>Expense Report</option>
                            <option>Profit & Loss</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">From Date</label>
                        <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">To Date</label>
                        <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100" />
                    </div>
                    <div className="flex items-end">
                        <button className="w-full px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors">
                            Generate
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800">Daily Summary</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Invoices</th>
                                <th className="px-6 py-4">Sales</th>
                                <th className="px-6 py-4">Expenses</th>
                                <th className="px-6 py-4">Profit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { date: 'January 12th, 2026', invoices: 15, sales: 25000, expenses: 2500, profit: 22500 },
                                { date: 'January 11th, 2026', invoices: 12, sales: 18000, expenses: 1500, profit: 16500 },
                                { date: 'January 10th, 2026', invoices: 20, sales: 32000, expenses: 3000, profit: 29000 },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-700">{row.date}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.invoices}</td>
                                    <td className="px-6 py-4 text-blue-600 font-medium">PKR {row.sales.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-red-500">PKR {row.expenses.toLocaleString()}</td>
                                    <td className="px-6 py-4 font-semibold text-emerald-600">PKR {row.profit.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
