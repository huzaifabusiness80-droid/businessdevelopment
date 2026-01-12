import React from 'react';

const Settings = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-8">
                {/* Company Info */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Company Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Company Name</label>
                            <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100" placeholder="Your Company Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                            <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100" placeholder="+92 300 1234567" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                            <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100" placeholder="Full address" />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Currency */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Currency</h2>
                    <div className="w-72">
                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100">
                            <option>PKR - Pakistani Rupee</option>
                            <option>USD - US Dollar</option>
                            <option>EUR - Euro</option>
                        </select>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Printer */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Printer</h2>
                    <div className="w-72">
                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100">
                            <option>Default Printer</option>
                            <option>Microsoft Print to PDF</option>
                        </select>
                    </div>
                </div>

                <button className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-sm">
                    Save Settings
                </button>
            </div>
        </div>
    );
};

export default Settings;
