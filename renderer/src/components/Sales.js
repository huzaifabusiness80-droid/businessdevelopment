import React from 'react';
import { ShoppingCart } from 'lucide-react';

const Sales = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Sales Management</h2>
                <button className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-600 transition-colors">
                    + New Sale
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Sales Module</h3>
                <p>Sales management functionality will appear here.</p>
            </div>
        </div>
    );
};

export default Sales;
