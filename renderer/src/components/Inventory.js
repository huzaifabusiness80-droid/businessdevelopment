import React from 'react';
import { Package } from 'lucide-react';

const Inventory = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
                <button className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-600 transition-colors">
                    + Add Product
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Inventory Module</h3>
                <p>Inventory management functionality will appear here.</p>
            </div>
        </div>
    );
};

export default Inventory;
