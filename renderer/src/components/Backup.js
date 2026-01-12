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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Backup & Restore</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {activeTab === 'local' && <LocalBackup />}
                    {activeTab === 'auto' && <AutoBackup />}
                    {activeTab === 'restore' && <RestoreBackup />}
                </div>
            </div>
        </div>
    );
};

const LocalBackup = () => (
    <div className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">One-click backup of the database file to a secure folder/drive.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg border text-center">
                <HardDrive size={48} className="mx-auto mb-4 text-blue-600" />
                <h3 className="font-bold text-gray-800 mb-2">Create Backup</h3>
                <p className="text-sm text-gray-500 mb-4">Save current database to backup folder</p>
                <button className="flex items-center justify-center space-x-2 w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                    <Download size={18} />
                    <span>Backup Now</span>
                </button>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg border">
                <h3 className="font-bold text-gray-800 mb-4">Backup Location</h3>
                <div className="flex items-center space-x-2 p-3 bg-white rounded border">
                    <input type="text" className="flex-1 text-sm text-gray-600" value="C:\BMS_Backups\" readOnly />
                    <button className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300">Browse</button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Tip: Use an external drive or cloud-synced folder for extra safety</p>
            </div>
        </div>

        <h3 className="font-bold text-gray-800">Recent Backups</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        <th className="px-6 py-4">Filename</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Size</th>
                        <th className="px-6 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[
                        { name: 'bms_backup_2026-01-12.db', date: '2026-01-12 18:30', size: '2.5 MB' },
                        { name: 'bms_backup_2026-01-11.db', date: '2026-01-11 20:15', size: '2.4 MB' },
                    ].map((backup, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{backup.name}</td>
                            <td className="px-6 py-4">{backup.date}</td>
                            <td className="px-6 py-4">{backup.size}</td>
                            <td className="px-6 py-4">
                                <button className="text-blue-600 text-sm hover:underline">Restore</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const AutoBackup = () => (
    <div className="space-y-6">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">Schedule automatic backups (e.g., on application close).</p>
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div>
                    <h4 className="font-medium">Enable Auto-Backup</h4>
                    <p className="text-sm text-gray-500">Automatically backup when closing the app</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div>
                    <h4 className="font-medium">Daily Backup</h4>
                    <p className="text-sm text-gray-500">Create backup at a specific time daily</p>
                </div>
                <div className="flex items-center space-x-2">
                    <input type="time" className="px-3 py-2 border rounded-lg" defaultValue="20:00" />
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div>
                    <h4 className="font-medium">Keep Last N Backups</h4>
                    <p className="text-sm text-gray-500">Automatically delete older backups</p>
                </div>
                <select className="px-3 py-2 border rounded-lg">
                    <option>Last 5</option>
                    <option>Last 10</option>
                    <option>Last 30</option>
                    <option>Keep All</option>
                </select>
            </div>
        </div>

        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            Save Settings
        </button>
    </div>
);

const RestoreBackup = () => (
    <div className="space-y-6">
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 flex items-start space-x-3">
            <AlertTriangle className="text-orange-600 mt-0.5" size={20} />
            <div>
                <p className="font-medium text-orange-800">Warning</p>
                <p className="text-sm text-orange-700">Restoring a backup will replace all current data. Make sure to backup current data first.</p>
            </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg border text-center">
            <Upload size={48} className="mx-auto mb-4 text-orange-600" />
            <h3 className="font-bold text-gray-800 mb-2">Restore from Backup</h3>
            <p className="text-sm text-gray-500 mb-4">Select a backup file to restore</p>
            <button className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700">
                <RotateCcw size={18} />
                <span>Choose Backup File</span>
            </button>
        </div>

        <h3 className="font-bold text-gray-800">Available Backups</h3>
        <div className="space-y-2">
            {[
                { name: 'bms_backup_2026-01-12.db', date: '2026-01-12 18:30', size: '2.5 MB' },
                { name: 'bms_backup_2026-01-11.db', date: '2026-01-11 20:15', size: '2.4 MB' },
            ].map((backup, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:border-blue-300">
                    <div>
                        <p className="font-medium">{backup.name}</p>
                        <p className="text-sm text-gray-500">{backup.date} • {backup.size}</p>
                    </div>
                    <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200">
                        Restore
                    </button>
                </div>
            ))}
        </div>
    </div>
);

export default Backup;
