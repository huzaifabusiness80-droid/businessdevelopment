import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus, Search, Edit, Trash2, X, Package,
    ShoppingCart, AlertTriangle, Check, Layers,
    Tag, DollarSign, Box
} from 'lucide-react';

// Premium Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        orange: 'from-orange-500 to-orange-600 shadow-orange-200',
        emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200',
        red: 'from-red-500 to-red-600 shadow-red-200',
        blue: 'from-blue-500 to-blue-600 shadow-blue-200',
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

const Products = ({ currentUser }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        id: null, name: '', sku: '', cost_price: 0, sell_price: 0,
        stock_qty: 0, alert_qty: 5, category_id: '', brand_id: ''
    });

    useEffect(() => { fetchData(); }, [currentUser]);

    const fetchData = async () => {
        if (currentUser?.company_id) {
            setLoading(true);
            const fetchedProducts = await window.electronAPI.getProducts(currentUser.company_id);
            const fetchedCategories = await window.electronAPI.getCategories(currentUser.company_id);
            const fetchedBrands = await window.electronAPI.getBrands(currentUser.company_id);

            setProducts(fetchedProducts || []);
            setCategories(fetchedCategories || []);
            setBrands(fetchedBrands || []);
            setLoading(false);
        }
    };

    const stats = useMemo(() => ({
        total: products.length,
        lowStock: products.filter(p => p.stockQty > 0 && p.stockQty <= (p.alertQty || 5)).length,
        outOfStock: products.filter(p => p.stockQty <= 0).length,
        totalValue: products.reduce((acc, p) => acc + (p.stockQty * p.sellPrice), 0)
    }), [products]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, companyId: currentUser.company_id };

        let result = formData.id
            ? await window.electronAPI.updateProduct(payload)
            : await window.electronAPI.createProduct(payload);

        if (result.success) {
            setIsModalOpen(false);
            setFormData({ id: null, name: '', sku: '', cost_price: 0, sell_price: 0, stock_qty: 0, alert_qty: 5, category_id: '', brand_id: '' });
            fetchData();
        } else {
            alert("Error: " + result.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const result = await window.electronAPI.deleteProduct(id);
            if (result.success) fetchData();
            else alert("Error: " + result.message);
        }
    };

    const openEdit = (product) => {
        setFormData({
            id: product.id, name: product.name, sku: product.sku,
            cost_price: product.costPrice, sell_price: product.sellPrice,
            stock_qty: product.stockQty, alert_qty: product.alertQty,
            category_id: product.categoryId || '', brand_id: product.brandId || ''
        });
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Products" value={stats.total} icon={Package} color="blue" />
                <StatCard title="Total Stock Value" value={`PKR ${stats.totalValue.toLocaleString()}`} icon={DollarSign} color="orange" />
                <StatCard title="Low Stock Items" value={stats.lowStock} icon={AlertTriangle} color="red" />
                <StatCard title="Out of Stock" value={stats.outOfStock} icon={X} color="gray" />
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/50 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/30">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-4 bg-white border border-transparent rounded-[1.5rem] text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-sm transition-all"
                            placeholder="Search by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setFormData({ id: null, name: '', sku: '', cost_price: 0, sell_price: 0, stock_qty: 0, alert_qty: 5, category_id: '', brand_id: '' });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center justify-center space-x-2 px-8 py-4 bg-orange-500 text-white rounded-[1.5rem] font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Add New Product</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Product Details</th>
                                <th className="px-8 py-5">Inventory</th>
                                <th className="px-8 py-5">Pricing</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-orange-50/20 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold transition-transform group-hover:scale-110">
                                                {product.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{product.name}</div>
                                                <div className="text-xs text-gray-400 font-medium">SKU: {product.sku || 'N/A'} • {product.brand?.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-gray-700">
                                        <div className="flex flex-col">
                                            <span>{product.stockQty} Units</span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-tighter">In Category: {product.category?.name || 'General'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-bold text-gray-900">PKR {product.sellPrice?.toLocaleString()}</div>
                                        <div className="text-[10px] text-gray-400 font-medium">Cost: PKR {product.costPrice?.toLocaleString()}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.stockQty > product.alertQty ? 'bg-emerald-100 text-emerald-700' :
                                            product.stockQty > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${product.stockQty > product.alertQty ? 'bg-emerald-500' :
                                                product.stockQty > 0 ? 'bg-orange-500' : 'bg-red-500'
                                                }`}></span>
                                            <span>
                                                {product.stockQty > product.alertQty ? 'Instock' :
                                                    product.stockQty > 0 ? 'Low Stock' : 'Out of Stock'}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            <button onClick={() => openEdit(product)} className="p-2.5 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2.5 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <Package size={48} className="mx-auto text-gray-100 mb-4" />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No products found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300 text-left">
                        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{formData.id ? 'Edit Product' : 'Add New Product'}</h2>
                                <p className="text-sm text-gray-400 mt-1 font-medium italic">Fill in the details to manage your inventory stock.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white hover:shadow-lg rounded-2xl transition-all text-gray-400"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-1">
                                        <Tag size={14} className="text-orange-500" /> Product Name *
                                    </label>
                                    <input required type="text" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. iPhone 15 Pro Max" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-1">
                                        <Layers size={14} className="text-orange-500" /> SKU Number
                                    </label>
                                    <input type="text" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold outline-none" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g. PHN-APL-15" />
                                </div>
                            </div>

                            {/* Classification */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-1">
                                        <Box size={14} className="text-orange-500" /> Category
                                    </label>
                                    <select className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold outline-none appearance-none cursor-pointer" value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-1">
                                        <Tag size={14} className="text-orange-500" /> Brand
                                    </label>
                                    <select className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold outline-none appearance-none cursor-pointer" value={formData.brand_id} onChange={e => setFormData({ ...formData, brand_id: e.target.value })}>
                                        <option value="">Select Brand</option>
                                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Inventory & Pricing */}
                            <div className="bg-orange-50/50 p-8 rounded-[2rem] border border-orange-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="col-span-1 lg:col-span-1">
                                    <label className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1 block">Cost Price</label>
                                    <input type="number" className="w-full bg-white px-4 py-3 rounded-xl border border-orange-100 font-bold outline-none focus:border-orange-500 transition-all" value={formData.cost_price} onChange={e => setFormData({ ...formData, cost_price: e.target.value })} />
                                </div>
                                <div className="col-span-1 lg:col-span-1">
                                    <label className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1 block">Sell Price</label>
                                    <input required type="number" className="w-full bg-white px-4 py-3 rounded-xl border border-orange-100 font-bold outline-none focus:border-orange-500 transition-all" value={formData.sell_price} onChange={e => setFormData({ ...formData, sell_price: e.target.value })} />
                                </div>
                                <div className="col-span-1 lg:col-span-1">
                                    <label className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1 block">Initial Stock</label>
                                    <input required type="number" className="w-full bg-white px-4 py-3 rounded-xl border border-orange-100 font-bold outline-none focus:border-orange-500 transition-all" value={formData.stock_qty} onChange={e => setFormData({ ...formData, stock_qty: e.target.value })} />
                                </div>
                                <div className="col-span-1 lg:col-span-1">
                                    <label className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1 block">Alert Level</label>
                                    <input type="number" className="w-full bg-white px-4 py-3 rounded-xl border border-orange-100 font-bold outline-none focus:border-orange-500 transition-all" value={formData.alert_qty} onChange={e => setFormData({ ...formData, alert_qty: e.target.value })} />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-[1.5rem] hover:shadow-[0_20px_50px_rgba(249,115,22,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg">
                                <Check size={24} />
                                {formData.id ? 'Save Product Changes' : 'Complete Product Setup'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
