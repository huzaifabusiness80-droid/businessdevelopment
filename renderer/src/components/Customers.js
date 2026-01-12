import React from 'react';
import { Users } from 'lucide-react';

const Customers = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
                <button className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-600 transition-colors">
                    + Add Customer
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Customers Module</h3>
                <p>Customer management functionality will appear here.</p>
            </div>
        </div>
    );
};

export default Customers;
