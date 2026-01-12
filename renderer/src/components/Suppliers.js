import React from 'react';
import { Plus, Search, MoreHorizontal } from 'lucide-react';

const Suppliers = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
                <button className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-sm">
                    <Plus size={18} />
                    <span>Add Supplier</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100" placeholder="Search suppliers..." />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Total Purchases</th>
                                <th className="px-6 py-4">Balance</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { name: 'ABC Suppliers', contact: 'Mr. Ahmed', phone: '0300-1234567', purchases: 75000, balance: 25000 },
                                { name: 'XYZ Trading', contact: 'Mr. Ali', phone: '0321-9876543', purchases: 45000, balance: 0 },
                                { name: 'Global Imports', contact: 'Ms. Fatima', phone: '0333-5555555', purchases: 120000, balance: 10000 },
                            ].map((supplier, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                                                {supplier.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-700">{supplier.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{supplier.contact}</td>
                                    <td className="px-6 py-4 text-gray-500">{supplier.phone}</td>
                                    <td className="px-6 py-4 text-gray-700">PKR {supplier.purchases.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${supplier.balance > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                            PKR {supplier.balance.toLocaleString()}
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

export default Suppliers;
