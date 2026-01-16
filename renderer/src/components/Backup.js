import React, { useState } from 'react';
import { HardDrive, Clock, RotateCcw, Download, Upload, AlertTriangle } from 'lucide-react';

const tabs = [
    { id: 'local', label: 'Local Backup', icon: HardDrive },
    { id: 'auto', label: 'Auto-Backup', icon: Clock },
    { id: 'restore', label: 'Restore', icon: RotateCcw },
];

const Backup = () => {
    const [activeTab, setActiveTab] = useState('local');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Redundancy</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage database snapshots and automated recovery protocols.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col transition-all">
                {/* Modern Tab Bar */}
                <div className="flex items-center px-4 bg-slate-50/20 border-b border-slate-100 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center space-x-3 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap group ${activeTab === tab.id
                                ? 'text-blue-600'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <tab.icon size={16} />
                            <span>{tab.label}</span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-8 flex-1 bg-white">
                    {activeTab === 'local' && <LocalBackup />}
                    {activeTab === 'auto' && <AutoBackup />}
                    {activeTab === 'restore' && <RestoreBackup />}
                </div>
            </div>
        </div>
    );
};

const LocalBackup = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
            <HardDrive size={16} />
            Execute manual database serialization for secure local storage.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 rounded-xl border border-slate-200 text-center flex flex-col items-center group hover:bg-white transition-all">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Download size={32} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">Create New Snapshot</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Immediate database containment</p>
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-100 active:scale-95 text-[10px] uppercase tracking-widest">
                    Initialize Backup
                </button>
            </div>

            <div className="p-8 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-6">Target Destination</h3>
                <div className="space-y-4">
                    <div className="relative group">
                        <input
                            type="text"
                            className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all"
                            value="C:\BMS_Snapshots\"
                            readOnly
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors">Change</button>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        Recommend external cloud-mapped drive
                    </p>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-3.5 bg-blue-600 rounded-full"></div>
                Historical Ledger Records
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Snapshot Filename</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Auth Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">File Payload</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Utility</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {[
                            { name: 'bms_snapshot_2026_01_12.db', date: 'Jan 12, 18:30', size: '2.5 MB' },
                            { name: 'bms_snapshot_2026_01_11.db', date: 'Jan 11, 20:15', size: '2.4 MB' },
                        ].map((backup, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 text-xs font-bold text-slate-800 tracking-tight">{backup.name}</td>
                                <td className="px-6 py-4 text-xs font-bold text-slate-400 tracking-tight">{backup.date}</td>
                                <td className="px-6 py-4 text-xs font-bold text-slate-400 tracking-tight">{backup.size}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all">Restore</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const AutoBackup = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
            <Clock size={16} />
            Scheduled redundancy protocols are currently active.
        </div>

        <div className="space-y-4">
            {[
                { label: 'Closure Redundancy', desc: 'Auto-snapshot upon application termination', active: true },
                { label: 'Chronos Schedule', desc: 'Execute snapshot at specific daily markers', active: false, time: '20:00' },
                { label: 'Retention Policy', desc: 'Maximum historical snapshots to preserve', active: true, value: 'Last 10 Records' },
            ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">{item.label}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.desc}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                        {item.time && <input type="time" className="px-3 py-1 text-xs font-bold border border-slate-200 rounded bg-white text-slate-800" defaultValue={item.time} />}
                        {item.value && (
                            <select className="px-3 py-1 text-[10px] font-bold border border-slate-200 rounded bg-white text-slate-800 uppercase tracking-widest">
                                <option>{item.value}</option>
                                <option>Last 20 Records</option>
                                <option>Last 50 Records</option>
                            </select>
                        )}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={item.active} className="sr-only peer" />
                            <div className="w-10 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex justify-end">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-100 active:scale-95 text-[10px] uppercase tracking-widest">
                Commit Protocol Changes
            </button>
        </div>
    </div>
);

const RestoreBackup = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="p-6 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} />
            </div>
            <div>
                <p className="text-xs font-black text-rose-800 uppercase tracking-tight">Destructive Restoration Protocol</p>
                <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mt-1">
                    Proceeding with restoration will overwrite all operational dataset fragments. Ensure a pre-restore snapshot exists.
                </p>
            </div>
        </div>

        <div className="p-12 bg-slate-50 rounded-xl border border-slate-200 text-center flex flex-col items-center group hover:bg-white transition-all">
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-amber-100 shadow-sm shadow-amber-50">
                <Upload size={40} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">Initialize Data Recovery</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Select target snapshot binary for induction</p>
            <button className="px-10 py-3.5 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-all shadow-md active:scale-95 text-[10px] uppercase tracking-widest">
                Upload Recovery File
            </button>
        </div>
    </div>
);

export default Backup;
