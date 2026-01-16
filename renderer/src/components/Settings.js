import React from 'react';

const Settings = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Configure your organization's core preferences and hardware.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-10">
                {/* Company Info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Organization Profile</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Company Legal Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all"
                                placeholder="Your Company Name"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Primary Contact Phone</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all"
                                placeholder="+92 300 1234567"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Registered Office Address</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all"
                                placeholder="Full physical or digital address"
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Currency */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Localizations & Currency</h2>
                    </div>
                    <div className="w-full md:w-80">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Base Transaction Currency</label>
                        <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all">
                            <option>PKR - Pakistani Rupee</option>
                            <option>USD - US Dollar</option>
                            <option>EUR - Euro</option>
                        </select>
                    </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Printer */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Hardware Integrations</h2>
                    </div>
                    <div className="w-full md:w-80">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Default Thermal/POS Printer</label>
                        <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all">
                            <option>System Default Printer</option>
                            <option>Microsoft Print to PDF</option>
                            <option>Zonal Thermal-58</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4">
                    <button className="flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-100 active:scale-95 text-[10px] uppercase tracking-widest tracking-widest">
                        Commit Global Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
