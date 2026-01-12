import React from 'react';
import { Plus, Search, MoreHorizontal } from 'lucide-react';

const Purchase = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Purchase</h1>
                <button className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-sm">
                    <Plus size={18} />
                    <span>New Purchase</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Total Purchases</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">PKR 120,000</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Paid</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">PKR 95,000</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-orange-500 mt-1">PKR 25,000</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100" placeholder="Search purchases..." />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Purchase #</th>
                                <th className="px-6 py-4">Supplier</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { id: 'PO-001', supplier: 'ABC Suppliers', date: 'January 12th, 2026', amount: 50000, status: 'Paid' },
                                { id: 'PO-002', supplier: 'XYZ Trading', date: 'January 10th, 2026', amount: 25000, status: 'Pending' },
                                { id: 'PO-003', supplier: 'Global Imports', date: 'January 8th, 2026', amount: 45000, status: 'Paid' },
                            ].map((purchase, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-700">{purchase.id}</td>
                                    <td className="px-6 py-4 text-gray-600">{purchase.supplier}</td>
                                    <td className="px-6 py-4 text-gray-500">{purchase.date}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">PKR {purchase.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center space-x-1 text-xs font-medium ${purchase.status === 'Paid' ? 'text-emerald-600' : 'text-orange-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${purchase.status === 'Paid' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                                            <span>{purchase.status}</span>
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

export default Purchase;
