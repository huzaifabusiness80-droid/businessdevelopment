import React from 'react';
import { Plus, Search, MoreHorizontal } from 'lucide-react';

const Expenses = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
                <button className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-sm">
                    <Plus size={18} />
                    <span>Add Expense</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Today</p>
                    <p className="text-2xl font-bold text-red-500 mt-1">PKR 2,500</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">This Week</p>
                    <p className="text-2xl font-bold text-orange-500 mt-1">PKR 12,000</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">This Month</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">PKR 45,000</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100" placeholder="Search expenses..." />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { date: 'January 12th, 2026', category: 'Utilities', desc: 'Electricity Bill', amount: 1500 },
                                { date: 'January 12th, 2026', category: 'Tea/Snacks', desc: 'Daily tea', amount: 500 },
                                { date: 'January 11th, 2026', category: 'Rent', desc: 'Shop rent', amount: 25000 },
                                { date: 'January 10th, 2026', category: 'Transport', desc: 'Delivery charges', amount: 2000 },
                            ].map((expense, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-500">{expense.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">{expense.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{expense.desc}</td>
                                    <td className="px-6 py-4 font-semibold text-red-500">PKR {expense.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
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

export default Expenses;
