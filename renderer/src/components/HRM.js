import React, { useState } from 'react';
import { Users, Calendar, DollarSign, Plus, Search, Edit, Eye } from 'lucide-react';

const tabs = [
    { id: 'employees', label: 'Employee List', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
];

const HRM = () => {
    const [activeTab, setActiveTab] = useState('employees');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">HRM & Payroll</h1>
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
                    {activeTab === 'employees' && <EmployeeList />}
                    {activeTab === 'attendance' && <Attendance />}
                    {activeTab === 'payroll' && <Payroll />}
                </div>
            </div>
        </div>
    );
};

const EmployeeList = () => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64" placeholder="Search employees..." />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                <Plus size={18} />
                <span>Add Employee</span>
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Designation</th>
                        <th className="px-6 py-4">Phone</th>
                        <th className="px-6 py-4">Salary</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[
                        { id: 'EMP-001', name: 'Ahmed Khan', designation: 'Manager', phone: '0300-1234567', salary: 50000, status: 'Active' },
                        { id: 'EMP-002', name: 'Ali Raza', designation: 'Cashier', phone: '0321-9876543', salary: 25000, status: 'Active' },
                        { id: 'EMP-003', name: 'Sara Ahmed', designation: 'Accountant', phone: '0333-5555555', salary: 35000, status: 'Active' },
                    ].map((emp, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{emp.id}</td>
                            <td className="px-6 py-4">{emp.name}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{emp.designation}</span></td>
                            <td className="px-6 py-4">{emp.phone}</td>
                            <td className="px-6 py-4 font-semibold">PKR {emp.salary.toLocaleString()}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{emp.status}</span></td>
                            <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                    <button className="p-1 text-gray-400 hover:text-blue-600"><Eye size={16} /></button>
                                    <button className="p-1 text-gray-400 hover:text-blue-600"><Edit size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const Attendance = () => {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <input type="date" className="px-4 py-2 border border-gray-200 rounded-lg" defaultValue={today} />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Load</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-gray-500">Present</p>
                    <p className="text-2xl font-bold text-green-600">3</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm text-gray-500">Absent</p>
                    <p className="text-2xl font-bold text-red-600">0</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <p className="text-sm text-gray-500">Late</p>
                    <p className="text-2xl font-bold text-yellow-600">1</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Leave</p>
                    <p className="text-2xl font-bold text-gray-600">0</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Check In</th>
                            <th className="px-6 py-4">Check Out</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {[
                            { name: 'Ahmed Khan', checkIn: '09:00', checkOut: '-', status: 'Present' },
                            { name: 'Ali Raza', checkIn: '09:30', checkOut: '-', status: 'Late' },
                            { name: 'Sara Ahmed', checkIn: '08:55', checkOut: '-', status: 'Present' },
                        ].map((att, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{att.name}</td>
                                <td className="px-6 py-4">{att.checkIn}</td>
                                <td className="px-6 py-4">{att.checkOut}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${att.status === 'Present' ? 'bg-green-100 text-green-700' :
                                            att.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>{att.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <select className="px-2 py-1 border rounded text-xs">
                                        <option>Present</option>
                                        <option>Absent</option>
                                        <option>Late</option>
                                        <option>Leave</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                Save Attendance
            </button>
        </div>
    );
};

const Payroll = () => (
    <div className="space-y-4">
        <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
                <option>January 2026</option>
                <option>December 2025</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                <Plus size={18} />
                <span>Generate Payroll</span>
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Basic Pay</th>
                        <th className="px-6 py-4">Bonuses</th>
                        <th className="px-6 py-4">Deductions</th>
                        <th className="px-6 py-4">Net Salary</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[
                        { name: 'Ahmed Khan', basic: 50000, bonus: 5000, deductions: 2000, status: 'Pending' },
                        { name: 'Ali Raza', basic: 25000, bonus: 0, deductions: 1000, status: 'Paid' },
                        { name: 'Sara Ahmed', basic: 35000, bonus: 2000, deductions: 1500, status: 'Pending' },
                    ].map((pay, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{pay.name}</td>
                            <td className="px-6 py-4">PKR {pay.basic.toLocaleString()}</td>
                            <td className="px-6 py-4 text-green-600">+PKR {pay.bonus.toLocaleString()}</td>
                            <td className="px-6 py-4 text-red-600">-PKR {pay.deductions.toLocaleString()}</td>
                            <td className="px-6 py-4 font-bold">PKR {(pay.basic + pay.bonus - pay.deductions).toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs ${pay.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{pay.status}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                    <button className="text-blue-600 text-xs hover:underline">View Slip</button>
                                    {pay.status === 'Pending' && <button className="text-green-600 text-xs hover:underline">Mark Paid</button>}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm text-gray-500">Total Payroll</p>
                    <p className="text-xl font-bold">PKR 112,500</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Paid</p>
                    <p className="text-xl font-bold text-green-600">PKR 24,000</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-xl font-bold text-yellow-600">PKR 88,500</p>
                </div>
            </div>
        </div>
    </div>
);

export default HRM;
