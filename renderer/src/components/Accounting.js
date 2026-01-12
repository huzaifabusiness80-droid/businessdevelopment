import React, { useState } from 'react';
import { List, FileEdit, Receipt, BookOpen, Scale, Plus } from 'lucide-react';

const tabs = [
    { id: 'chart', label: 'Chart of Accounts', icon: List },
    { id: 'journal', label: 'Journal Entries', icon: FileEdit },
    { id: 'expenses', label: 'Expense Tracking', icon: Receipt },
    { id: 'ledger', label: 'General Ledger', icon: BookOpen },
    { id: 'trial', label: 'Trial Balance', icon: Scale },
];

const Accounting = () => {
    const [activeTab, setActiveTab] = useState('chart');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Accounting & Ledger</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
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
                    {activeTab === 'chart' && <ChartOfAccounts />}
                    {activeTab === 'journal' && <JournalEntries />}
                    {activeTab === 'expenses' && <ExpenseTracking />}
                    {activeTab === 'ledger' && <GeneralLedger />}
                    {activeTab === 'trial' && <TrialBalance />}
                </div>
            </div>
        </div>
    );
};

const ChartOfAccounts = () => (
    <div className="space-y-4">
        <div className="flex justify-end">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                <Plus size={18} />
                <span>Add Account</span>
            </button>
        </div>
        <div className="space-y-4">
            {[
                { type: 'Assets', accounts: ['Cash in Hand', 'Bank Account', 'Accounts Receivable', 'Inventory'], color: 'blue' },
                { type: 'Liabilities', accounts: ['Accounts Payable', 'Loans Payable'], color: 'red' },
                { type: 'Equity', accounts: ['Owner Capital', 'Retained Earnings'], color: 'purple' },
                { type: 'Income', accounts: ['Sales Revenue', 'Service Income'], color: 'green' },
                { type: 'Expenses', accounts: ['Rent', 'Utilities', 'Salaries', 'Supplies'], color: 'orange' },
            ].map((category, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                    <div className={`px-4 py-3 bg-${category.color}-50 border-b font-medium text-${category.color}-700`}>
                        {category.type}
                    </div>
                    <div className="divide-y">
                        {category.accounts.map((account, j) => (
                            <div key={j} className="px-4 py-3 flex justify-between items-center hover:bg-gray-50">
                                <span>{account}</span>
                                <button className="text-sm text-blue-600 hover:underline">View</button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const JournalEntries = () => (
    <div className="space-y-4">
        <div className="flex justify-end">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                <Plus size={18} />
                <span>New Entry</span>
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Reference</th>
                        <th className="px-6 py-4">Account</th>
                        <th className="px-6 py-4">Debit</th>
                        <th className="px-6 py-4">Credit</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">2026-01-12</td>
                        <td className="px-6 py-4">JE-001</td>
                        <td className="px-6 py-4">Cash in Hand</td>
                        <td className="px-6 py-4">PKR 10,000</td>
                        <td className="px-6 py-4">-</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">2026-01-12</td>
                        <td className="px-6 py-4">JE-001</td>
                        <td className="px-6 py-4">Sales Revenue</td>
                        <td className="px-6 py-4">-</td>
                        <td className="px-6 py-4">PKR 10,000</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const ExpenseTracking = () => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">Record daily shop expenses</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                <Plus size={18} />
                <span>Add Expense</span>
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm text-gray-500">Today's Expenses</p>
                <p className="text-2xl font-bold text-red-600">PKR 2,500</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-orange-600">PKR 12,000</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-yellow-600">PKR 45,000</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Total Categories</p>
                <p className="text-2xl font-bold text-gray-800">8</p>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[
                        { date: '2026-01-12', category: 'Utilities', desc: 'Electricity Bill', amount: 1500 },
                        { date: '2026-01-12', category: 'Tea/Snacks', desc: 'Daily tea', amount: 500 },
                        { date: '2026-01-11', category: 'Rent', desc: 'Shop rent Jan', amount: 25000 },
                    ].map((expense, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4">{expense.date}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{expense.category}</span></td>
                            <td className="px-6 py-4">{expense.desc}</td>
                            <td className="px-6 py-4 font-semibold text-red-600">PKR {expense.amount.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const GeneralLedger = () => (
    <div className="space-y-4">
        <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-gray-200 rounded-lg">
                <option>Select Account</option>
                <option>Cash in Hand</option>
                <option>Bank Account</option>
                <option>Sales Revenue</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">View Ledger</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Debit</th>
                        <th className="px-6 py-4">Credit</th>
                        <th className="px-6 py-4">Balance</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">2026-01-01</td>
                        <td className="px-6 py-4">Opening Balance</td>
                        <td className="px-6 py-4">PKR 100,000</td>
                        <td className="px-6 py-4">-</td>
                        <td className="px-6 py-4 font-semibold">PKR 100,000</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">2026-01-12</td>
                        <td className="px-6 py-4">Sale - INV-1023</td>
                        <td className="px-6 py-4">PKR 15,000</td>
                        <td className="px-6 py-4">-</td>
                        <td className="px-6 py-4 font-semibold">PKR 115,000</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const TrialBalance = () => (
    <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">Summary of all ledger balances to ensure books are balanced.</p>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        <th className="px-6 py-4">Account</th>
                        <th className="px-6 py-4 text-right">Debit</th>
                        <th className="px-6 py-4 text-right">Credit</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[
                        { account: 'Cash in Hand', debit: 115000, credit: 0 },
                        { account: 'Accounts Receivable', debit: 23500, credit: 0 },
                        { account: 'Inventory', debit: 250000, credit: 0 },
                        { account: 'Accounts Payable', debit: 0, credit: 35000 },
                        { account: 'Owner Capital', debit: 0, credit: 300000 },
                        { account: 'Sales Revenue', debit: 0, credit: 85000 },
                        { account: 'Expenses', debit: 31500, credit: 0 },
                    ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4">{row.account}</td>
                            <td className="px-6 py-4 text-right">{row.debit > 0 ? `PKR ${row.debit.toLocaleString()}` : '-'}</td>
                            <td className="px-6 py-4 text-right">{row.credit > 0 ? `PKR ${row.credit.toLocaleString()}` : '-'}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-gray-100 font-bold">
                    <tr>
                        <td className="px-6 py-4">Total</td>
                        <td className="px-6 py-4 text-right">PKR 420,000</td>
                        <td className="px-6 py-4 text-right">PKR 420,000</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <p className="text-green-700 font-medium">✓ Books are balanced</p>
        </div>
    </div>
);

export default Accounting;
