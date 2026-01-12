import React from 'react';
import { BarChart3 } from 'lucide-react';

const Reports = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
                <div className="space-x-2">
                    <button className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Reports Module</h3>
                <p>Analytics and reporting functionality will appear here.</p>
            </div>
        </div>
    );
};

export default Reports;
