import React from 'react';
import { Plus, Search, MoreHorizontal } from 'lucide-react';

const Sales = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Sales</h1>
                <button className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-sm">
                    <Plus size={18} />
                    <span>New Sale</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Today's Sales</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">PKR 25,000</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">This Week</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">PKR 85,000</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Total Invoices</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">156</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-orange-500 mt-1">PKR 12,500</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100" placeholder="Search sales..." />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Invoice #</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { id: 'INV-1023', customer: 'Ali Traders', date: 'January 12th, 2026', amount: 15000, status: 'Finished' },
                                { id: 'INV-1022', customer: 'Walk-in', date: 'January 12th, 2026', amount: 2500, status: 'Finished' },
                                { id: 'INV-1021', customer: 'XYZ Company', date: 'January 11th, 2026', amount: 8500, status: 'Pending' },
                                { id: 'INV-1020', customer: 'ABC Store', date: 'January 11th, 2026', amount: 4000, status: 'Cancel' },
                            ].map((sale, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-700">{sale.id}</td>
                                    <td className="px-6 py-4 text-gray-600">{sale.customer}</td>
                                    <td className="px-6 py-4 text-gray-500">{sale.date}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">PKR {sale.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center space-x-1 text-xs font-medium ${sale.status === 'Finished' ? 'text-emerald-600' :
                                                sale.status === 'Pending' ? 'text-orange-500' : 'text-red-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${sale.status === 'Finished' ? 'bg-emerald-500' :
                                                    sale.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'
                                                }`}></span>
                                            <span>{sale.status}</span>
                                        </span>
                                    </td>
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

export default Sales;
