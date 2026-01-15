import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Edit2, Trash2, User, Phone,
    MapPin, Mail, CreditCard, TrendingUp, Users,
    DollarSign, X, Check, Loader2, MoreVertical
} from 'lucide-react';

// Reusable Components matching the design system
// Premium Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        orange: 'from-orange-500 to-orange-600 shadow-orange-200',
        emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200',
        red: 'from-red-500 to-red-600 shadow-red-200',
        blue: 'from-blue-500 to-blue-600 shadow-blue-200',
        purple: 'from-purple-500 to-purple-600 shadow-purple-200',
        gray: 'from-gray-500 to-gray-600 shadow-gray-200'
    };

    return (
        <div className={`relative overflow-hidden bg-gradient-to-br ${colors[color]} p-6 rounded-[2rem] text-white shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
            <div className="relative flex items-center justify-between">
                <div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

const Modal = ({ title, children, onClose, size = 'md' }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className={`bg-white rounded-[2.5rem] shadow-2xl w-full ${size === 'lg' ? 'max-w-4xl' : 'max-w-xl'} overflow-hidden animate-in zoom-in-95 duration-200`}>
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 max-h-[85vh] overflow-y-auto scrollbar-hide">{children}</div>
        </div>
    </div>
);

const Customers = ({ currentUser }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', creditLimit: 0 });

    useEffect(() => { loadCustomers(); }, [currentUser]);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            if (window.electronAPI) {
                const data = await window.electronAPI.getCustomers(currentUser?.company_id);
                setCustomers(data || []);
            }
        } catch (err) {
            console.error('Error loading customers:', err);
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = { ...formData, companyId: currentUser?.company_id };
            let result;
            if (formData.id) {
                result = await window.electronAPI.updateCustomer(data);
            } else {
                result = await window.electronAPI.createCustomer(data);
            }

            if (result?.success === false) {
                window.alert(result.message);
            } else {
                setShowModal(false);
                loadCustomers();
            }
        } catch (err) {
            window.alert('Error saving customer: ' + err.message);
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) return;
        try {
            const result = await window.electronAPI.deleteCustomer(id);
            if (result?.success === false) {
                window.alert(result.message);
            } else {
                loadCustomers();
            }
        } catch (err) {
            window.alert('Error deleting customer: ' + err.message);
        }
    };

    const openModal = (customer = null) => {
        setFormData(customer ? { ...customer } : { name: '', phone: '', email: '', address: '', creditLimit: 0 });
        setShowModal(true);
    };

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );

    const totalBalance = customers.reduce((acc, c) => acc + (c.balance || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Management</h1>
                    <p className="text-gray-500 mt-1">Manage your clients, track balances and credit limits.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all active:scale-95 shadow-md group"
                >
                    <div className="p-1 px-1.5 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                        <Plus size={18} />
                    </div>
                    <span>Add New Customer</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Customers" value={customers.length} icon={Users} color="orange" />
                <StatCard title="Total Receivables" value={`PKR ${totalBalance.toLocaleString()}`} icon={DollarSign} color="emerald" />
                <StatCard title="Active Credit" value={`PKR ${(totalBalance * 0.8).toLocaleString()}`} icon={CreditCard} color="blue" />
                <StatCard title="New This Month" value="12" icon={TrendingUp} color="purple" />
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm"
                            placeholder="Search by name or phone number..."
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={loadCustomers} className="p-3 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-gray-200 bg-white">
                            <Loader2 size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Customer</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Contact Info</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Address</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Balance</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium">Loading customers...</td></tr>
                            ) : filtered.length > 0 ? (
                                filtered.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{customer.name}</p>
                                                    <p className="text-xs text-gray-400 font-medium mt-0.5">ID: {customer.id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center text-gray-600 text-sm font-medium gap-2">
                                                    <Phone size={14} className="text-gray-400" /> {customer.phone || 'N/A'}
                                                </div>
                                                <div className="flex items-center text-gray-400 text-xs font-medium gap-2">
                                                    <Mail size={14} /> {customer.email || 'No email provided'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-xs">
                                            <div className="flex items-center text-gray-600 text-sm gap-2">
                                                <MapPin size={16} className="text-orange-400 shrink-0" />
                                                <span className="truncate">{customer.address || 'No address set'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className={`text-base font-bold ${customer.balance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                    PKR {(customer.balance || 0).toLocaleString()}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Limit: PKR {(customer.creditLimit || 0).toLocaleString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => openModal(customer)}
                                                    className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-100"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
                                                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 border border-transparent hover:border-red-100"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-32 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <User size={32} className="text-gray-200" />
                                            </div>
                                            <h3 className="text-gray-900 font-bold text-lg mb-1">No Customers Found</h3>
                                            <p className="text-gray-400 text-sm">Add your first customer to start tracking sales and balances.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <Modal title={formData.id ? 'Update Customer Details' : 'Register New Customer'} onClose={() => setShowModal(false)} size="lg">
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                                    Basic Information
                                </h4>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                                            placeholder="e.g. Ali Khan"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                                            placeholder="03xx-xxxxxxx"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                                            placeholder="customer@email.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                                    Additional Details
                                </h4>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Credit Limit (PKR)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            value={formData.creditLimit}
                                            onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Shipping/Billing Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                                        <textarea
                                            rows="4"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                                            placeholder="Store address, city, etc."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-6 py-3.5 text-gray-500 font-bold hover:text-gray-700 transition-all rounded-2xl border border-transparent hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                {formData.id ? 'Update Customer' : 'Add Customer'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default Customers;
