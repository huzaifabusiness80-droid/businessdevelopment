import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Edit2, Trash2, Building2, Phone,
    Mail, MapPin, Truck, DollarSign, X, Check,
    MoreHorizontal, TrendingDown, Clock, Info
} from 'lucide-react';

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
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

const Suppliers = ({ currentUser }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });

    useEffect(() => { loadSuppliers(); }, [currentUser]);

    const loadSuppliers = async () => {
        setLoading(true);
        try {
            if (window.electronAPI) {
                const data = await window.electronAPI.getVendors(currentUser?.company_id);
                setSuppliers(data || []);
            }
        } catch (err) {
            console.error('Error loading suppliers:', err);
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
                result = await window.electronAPI.updateVendor(data);
            } else {
                result = await window.electronAPI.createVendor(data);
            }

            if (result?.success === false) {
                window.alert(result.message);
            } else {
                setShowModal(false);
                loadSuppliers();
            }
        } catch (err) {
            window.alert('Error saving supplier: ' + err.message);
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this supplier?')) return;
        try {
            const result = await window.electronAPI.deleteVendor(id);
            if (result?.success === false) {
                window.alert(result.message);
            } else {
                loadSuppliers();
            }
        } catch (err) {
            window.alert('Error deleting supplier: ' + err.message);
        }
    };

    const openModal = (supplier = null) => {
        setFormData(supplier ? { ...supplier } : { name: '', phone: '', email: '', address: '' });
        setShowModal(true);
    };

    const filtered = suppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.phone?.includes(search)
    );

    const totalPayable = suppliers.reduce((acc, s) => acc + (s.balance || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Supplier Directory</h1>
                    <p className="text-gray-500 mt-1">Manage your vendors, supply chain partners and payables.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all active:scale-95 shadow-md group"
                >
                    <div className="p-1 px-1.5 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                        <Plus size={18} />
                    </div>
                    <span>Onboard New Supplier</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Vendors" value={suppliers.length} icon={Truck} color="orange" />
                <StatCard title="Total Payables" value={`PKR ${totalPayable.toLocaleString()}`} icon={DollarSign} color="red" />
                <StatCard title="Active Orders" value="5" icon={Clock} color="blue" />
                <StatCard title="Recent Savings" value="8%" icon={TrendingDown} color="emerald" />
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
                            placeholder="Search by vendor name or contact..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Vendor Profile</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Contact Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Location</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Outstandings</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                                            <p className="text-gray-400 font-bold">Fetching suppliers...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="max-w-xs mx-auto space-y-3">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                                                <Truck size={32} />
                                            </div>
                                            <p className="text-gray-400 font-bold">No suppliers found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map((supplier) => (
                                <tr key={supplier.id} className="hover:bg-orange-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-orange-400 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                                    {supplier.name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{supplier.name}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-0.5">Partner ID: {supplier.id?.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                                                <Phone size={14} className="text-gray-400" />
                                                {supplier.phone || 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                                <Mail size={14} className="text-gray-300" />
                                                {supplier.email || 'no-email@vendor.com'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-start gap-2 max-w-[180px]">
                                            <MapPin size={14} className="text-gray-300 mt-1 shrink-0" />
                                            <p className="text-xs text-gray-500 font-medium line-clamp-2">{supplier.address || 'Address not listed'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-black border ${(supplier.balance || 0) > 0
                                                ? 'bg-red-50 text-red-600 border-red-100'
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                            PKR {(supplier.balance || 0).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openModal(supplier)}
                                                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(supplier.id)}
                                                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Redesigned Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">{formData.id ? 'Modify Supplier Profile' : 'Register New Vendor'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Company Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-bold text-gray-900"
                                            placeholder="e.g. Global Tech Solutions"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-bold text-gray-900"
                                                placeholder="+92 300 1234567"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-bold text-gray-900"
                                                placeholder="sales@vendor.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Business Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 text-gray-300" size={18} />
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows="3"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-bold text-gray-900 resize-none"
                                            placeholder="Full physical address of the vendor..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-8 py-4 text-gray-500 font-bold hover:text-gray-900 transition-colors"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                                >
                                    {saving ? 'Saving...' : formData.id ? 'Update Supplier' : 'Save Supplier'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Suppliers;
