import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Edit2, Trash2, ShoppingCart, Calendar,
    User, DollarSign, X, Check, MoreHorizontal, ArrowUpRight,
    Package, Truck, Receipt, Trash, Info
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
        <div className={`relative overflow-hidden bg-gradient-to-br ${colors[color] || colors.orange} p-6 rounded-[2rem] text-white shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group`}>
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

const Purchase = ({ currentUser }) => {
    const [purchases, setPurchases] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [vendorId, setVendorId] = useState('');
    const [invoiceNo, setInvoiceNo] = useState('');
    const [cart, setCart] = useState([]);
    const [paidAmount, setPaidAmount] = useState('');

    useEffect(() => {
        loadData();
    }, [currentUser]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (window.electronAPI) {
                const [pData, vData, prData] = await Promise.all([
                    window.electronAPI.getPurchases(currentUser?.company_id),
                    window.electronAPI.getVendors(currentUser?.company_id),
                    window.electronAPI.getProducts(currentUser?.company_id)
                ]);
                setPurchases(pData || []);
                setVendors(vData || []);
                setProducts(prData || []);
            }
        } catch (err) {
            console.error('Error loading purchase data:', err);
        }
        setLoading(false);
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1, unitCost: product.cost_price || 0 }]);
        }
    };

    const updateCartItem = (id, field, value) => {
        setCart(cart.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const calculateSubtotal = () => cart.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
    const subtotal = calculateSubtotal();

    const handleSave = async (e) => {
        e.preventDefault();
        if (!vendorId) return window.alert('Please select a vendor');
        if (cart.length === 0) return window.alert('Cart is empty');

        setSaving(true);
        try {
            const data = {
                companyId: currentUser?.company_id,
                vendorId,
                invoiceNo,
                totalAmount: subtotal,
                paidAmount: parseFloat(paidAmount) || 0,
                status: 'RECEIVED',
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitCost: item.unitCost,
                    total: item.quantity * item.unitCost
                }))
            };

            const result = await window.electronAPI.addPurchase(data);
            if (result?.success === false) {
                window.alert(result.message);
            } else {
                setShowModal(false);
                resetForm();
                loadData();
            }
        } catch (err) {
            window.alert('Error saving purchase: ' + err.message);
        }
        setSaving(false);
    };

    const resetForm = () => {
        setVendorId('');
        setInvoiceNo('');
        setCart([]);
        setPaidAmount('');
    };

    const filtered = purchases.filter(p =>
        p.invoiceNo?.toLowerCase().includes(search.toLowerCase()) ||
        p.vendor?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const totalStats = purchases.reduce((acc, p) => {
        acc.total += p.totalAmount;
        acc.paid += p.paidAmount;
        acc.pending += (p.totalAmount - p.paidAmount);
        return acc;
    }, { total: 0, paid: 0, pending: 0 });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Purchase Procurement</h1>
                    <p className="text-gray-500 mt-1">Record incoming stock, manage vendor invoices and procurement history.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all active:scale-95 shadow-md group"
                >
                    <div className="p-1 px-1.5 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                        <Plus size={18} />
                    </div>
                    <span>New Purchase Order</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Procurement" value={`PKR ${totalStats.total.toLocaleString()}`} icon={ShoppingCart} color="orange" />
                <StatCard title="Total Paid" value={`PKR ${totalStats.paid.toLocaleString()}`} icon={Check} color="emerald" />
                <StatCard title="Total Pending" value={`PKR ${totalStats.pending.toLocaleString()}`} icon={DollarSign} color="red" />
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
                            placeholder="Search by Invoice # or Vendor..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Procurement #</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Supplier</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Date/Time</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Total Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                                            <p className="text-gray-400 font-bold">Synchronizing purchases...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="max-w-xs mx-auto space-y-3">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                                                <Receipt size={32} />
                                            </div>
                                            <p className="text-gray-400 font-bold">No procurement records found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-orange-50/30 transition-colors group">
                                    <td className="px-8 py-6 font-black text-gray-900">{p.invoiceNo || `PO-${p.id.slice(-6).toUpperCase()}`}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                                                {p.vendor?.name?.charAt(0).toUpperCase() || 'V'}
                                            </div>
                                            <span className="font-bold text-gray-700">{p.vendor?.name || 'Unknown Vendor'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                                        {new Date(p.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-gray-900">PKR {p.totalAmount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${p.totalAmount <= p.paidAmount
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-orange-50 text-orange-600 border border-orange-100'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${p.totalAmount <= p.paidAmount ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                                            {p.totalAmount <= p.paidAmount ? 'Fully Paid' : 'Credit'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                            <Info size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Redesigned Purchase Modal (POS Style) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">New Procurement Order</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Record incoming stock from suppliers</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Left Side: Product Selection */}
                            <div className="w-1/2 p-8 border-r border-gray-100 flex flex-col gap-6 overflow-hidden">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500" size={20} />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all shadow-inner"
                                        placeholder="Scan barcode or type product name..."
                                    />
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 gap-4">
                                    {products.map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => addToCart(product)}
                                            className="p-4 bg-white border border-gray-100 rounded-[1.5rem] hover:border-orange-500 hover:shadow-lg transition-all group text-left relative overflow-hidden active:scale-95"
                                        >
                                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center shadow-lg"><Plus size={18} /></div>
                                            </div>
                                            <p className="font-black text-gray-900 truncate pr-6">{product.name}</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                                                    Stock: {product.stockQty}
                                                </span>
                                                <span className="text-sm font-black text-gray-600">PKR {product.costPrice?.toLocaleString() || '0'}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side: Cart & Details */}
                            <div className="w-1/2 p-8 bg-gray-50/50 flex flex-col overflow-hidden">
                                {/* Vendor & Invoice Info */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Supplier</label>
                                        <select
                                            value={vendorId}
                                            onChange={(e) => setVendorId(e.target.value)}
                                            className="w-full px-4 py-4 bg-white border border-transparent rounded-2xl font-bold text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all shadow-sm"
                                        >
                                            <option value="">Choose Supplier...</option>
                                            {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Supplier Invoice #</label>
                                        <input
                                            type="text"
                                            value={invoiceNo}
                                            onChange={(e) => setInvoiceNo(e.target.value)}
                                            className="w-full px-4 py-4 bg-white border border-transparent rounded-2xl font-bold text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all shadow-sm"
                                            placeholder="INV-2024-001"
                                        />
                                    </div>
                                </div>

                                {/* Cart Items */}
                                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                                    {cart.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                            <Package size={48} className="opacity-20" />
                                            <p className="font-bold text-sm">Procurement list is empty</p>
                                        </div>
                                    ) : cart.map((item) => (
                                        <div key={item.id} className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 truncate">{item.name}</p>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase">Cost:</span>
                                                        <input
                                                            type="number"
                                                            value={item.unitCost}
                                                            onChange={(e) => updateCartItem(item.id, 'unitCost', parseFloat(e.target.value))}
                                                            className="w-20 px-2 py-0.5 bg-gray-50 rounded text-xs font-bold text-gray-900 focus:ring-2 focus:ring-orange-500/10 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase">Qty:</span>
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateCartItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                            className="w-16 px-2 py-0.5 bg-gray-50 rounded text-xs font-bold text-gray-900 focus:ring-2 focus:ring-orange-500/10 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-black text-gray-900">PKR {(item.quantity * item.unitCost).toLocaleString()}</p>
                                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-500 mt-1 transition-colors"><Trash size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="mt-6 p-6 bg-white rounded-[2rem] shadow-lg border border-gray-100 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</span>
                                        <span className="text-2xl font-black text-gray-900">PKR {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Made (Paid Amount)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
                                            <input
                                                type="number"
                                                value={paidAmount}
                                                onChange={(e) => setPaidAmount(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-black text-xl text-gray-900 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all shadow-inner"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {saving ? 'Processing...' : 'Complete Procurement'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Purchase;
