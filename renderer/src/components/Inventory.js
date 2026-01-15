import React, { useState, useEffect } from 'react';
import {
    Package, Grid, BarChart2, AlertTriangle, Printer,
    Plus, Search, Edit, Trash2, Image, X,
    Check, TrendingUp, FolderKanban
} from 'lucide-react';
import Products from './Products';

// Premium Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        orange: 'from-orange-500 to-orange-600 shadow-orange-200',
        emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200',
        red: 'from-red-500 to-red-600 shadow-red-200',
        gray: 'from-gray-500 to-gray-600 shadow-gray-200',
        purple: 'from-purple-500 to-purple-600 shadow-purple-200'
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

const tabs = [
    { id: 'products', label: 'Products', icon: Package, color: 'orange' },
    { id: 'categories', label: 'Setup', icon: Grid, color: 'purple' },
    { id: 'stock', label: 'Tracking', icon: BarChart2, color: 'emerald' },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, color: 'red' },
    { id: 'barcode', label: 'Barcodes', icon: Printer, color: 'blue' },
];

const Inventory = ({ currentUser }) => {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
                    <p className="text-gray-500 mt-1">Track products, categories, stock levels and generate labels.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden min-h-[600px] flex flex-col">
                {/* Modern Tab Bar */}
                <div className="flex items-center px-8 bg-gray-50/50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center space-x-3 px-8 py-6 text-sm font-bold transition-all whitespace-nowrap group ${activeTab === tab.id
                                ? 'text-gray-900'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <div className={`p-2 rounded-xl transition-all duration-300 ${activeTab === tab.id
                                ? `bg-orange-500 text-white shadow-lg shadow-orange-200`
                                : 'bg-white text-gray-400 group-hover:bg-gray-100'
                                }`}>
                                <tab.icon size={18} />
                            </div>
                            <span>{tab.label}</span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-8 flex-1">
                    {activeTab === 'products' && <Products currentUser={currentUser} />}
                    {activeTab === 'categories' && <CategoriesBrands currentUser={currentUser} />}
                    {activeTab === 'stock' && <StockTracking currentUser={currentUser} />}
                    {activeTab === 'alerts' && <LowStockAlerts currentUser={currentUser} />}
                    {activeTab === 'barcode' && <BarcodePrinting currentUser={currentUser} />}
                </div>
            </div>
        </div>
    );
};

const CategoriesBrands = ({ currentUser }) => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [modalConfig, setModalConfig] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, [currentUser]);

    const fetchData = async () => {
        if (currentUser?.company_id) {
            setLoading(true);
            const fetchedCategories = await window.electronAPI.getCategories(currentUser.company_id);
            const fetchedBrands = await window.electronAPI.getBrands(currentUser.company_id);
            setCategories(fetchedCategories || []);
            setBrands(fetchedBrands || []);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const { type, item } = modalConfig;
        const payload = { id: item?.id, name, companyId: currentUser.company_id };

        let result;
        if (type === 'category') {
            result = item ? await window.electronAPI.updateCategory(payload)
                : await window.electronAPI.createCategory(payload);
        } else {
            result = item ? await window.electronAPI.updateBrand(payload)
                : await window.electronAPI.createBrand(payload);
        }

        if (result.success) {
            setModalConfig(null);
            setName('');
            fetchData();
        } else {
            alert("Error: " + result.message);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        let result = type === 'category'
            ? await window.electronAPI.deleteCategory(id)
            : await window.electronAPI.deleteBrand(id);
        if (result.success) fetchData();
        else alert("Error: " + result.message);
    };

    const openModal = (type, item = null) => {
        setModalConfig({ type, item });
        setName(item ? item.name : '');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {/* Categories & Brands Cards */}
            {[
                { title: 'Product Categories', data: categories, type: 'category', icon: Grid, color: 'orange' },
                { title: 'Product Brands', data: brands, type: 'brand', icon: FolderKanban, color: 'purple' }
            ].map((section) => (
                <div key={section.type} className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-50/50 overflow-hidden">
                    <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl bg-${section.color === 'orange' ? 'orange' : 'purple'}-100 text-${section.color === 'orange' ? 'orange' : 'purple'}-600`}>
                                <section.icon size={18} />
                            </div>
                            <h3 className="font-bold text-gray-900">{section.title}</h3>
                        </div>
                        <button
                            onClick={() => openModal(section.type)}
                            className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all active:scale-95"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-hide">
                        {loading ? (
                            <div className="py-20 text-center text-gray-400 text-sm font-medium">Loading...</div>
                        ) : section.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                                {section.data.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-orange-50/30 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:text-orange-500 transition-colors">
                                                {item.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-gray-700 group-hover:text-gray-900">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openModal(section.type, item)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit size={14} /></button>
                                            <button onClick={() => handleDelete(section.type, item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <section.icon size={32} className="mx-auto text-gray-200 mb-3" />
                                <p className="text-gray-400 text-sm font-medium">No {section.type}s found</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Premium Modal */}
            {modalConfig && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-left">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {modalConfig.item ? 'Edit' : 'Add'} {modalConfig.type === 'category' ? 'Category' : 'Brand'}
                            </h3>
                            <button onClick={() => setModalConfig(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-bold text-gray-700 ml-1">Name *</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={`e.g. ${modalConfig.type === 'category' ? 'Smartphones' : 'Apple'}`}
                                />
                            </div>
                            <button type="submit" className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <Check size={18} />
                                {modalConfig.item ? 'Save Changes' : 'Create Entry'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StockTracking = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Products" value="156" icon={Package} color="orange" />
            <StatCard title="In Stock" value="142" icon={Check} color="emerald" />
            <StatCard title="Low Stock" value="8" icon={AlertTriangle} color="red" />
            <StatCard title="Out of Stock" value="6" icon={X} color="gray" />
        </div>

        <div className="bg-orange-50/50 rounded-3xl p-8 border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-200">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-lg">Stock Adjustment</h4>
                    <p className="text-gray-500">Manually correct stock for damages, losses or returns.</p>
                </div>
            </div>
            <button className="px-8 py-4 bg-white text-orange-600 border-2 border-orange-100 font-bold rounded-2xl hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all active:scale-95 shadow-sm">
                New Adjustment
            </button>
        </div>
    </div>
);

const LowStockAlerts = ({ currentUser }) => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLowStock = async () => {
            if (currentUser?.company_id) {
                const products = await window.electronAPI.getProducts(currentUser.company_id);
                setLowStockProducts(products.filter(p => p.stockQty <= (p.alertQty || 5)));
                setLoading(false);
            }
        };
        fetchLowStock();
    }, [currentUser]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-red-50/50 rounded-3xl p-8 border border-red-100 flex items-center gap-6">
                <div className="p-4 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-200 animate-pulse">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-lg">Critical Inventory Alerts</h4>
                    <p className="text-gray-500">There are {lowStockProducts.length} items that require immediate attention.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50/50 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-5">Product Name</th>
                            <th className="px-8 py-5 text-center">Current Stock</th>
                            <th className="px-8 py-5 text-center">Alert Level</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {lowStockProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-red-50/20 transition-all">
                                <td className="px-8 py-6 font-bold text-gray-900">{p.name}</td>
                                <td className="px-8 py-6 text-center font-black text-red-600 bg-red-50/30">{p.stockQty}</td>
                                <td className="px-8 py-6 text-center font-bold text-gray-500">{p.alertQty || 5}</td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        {p.stockQty <= 0 ? 'Out of Stock' : 'Low Stock'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right font-bold text-orange-600 hover:underline cursor-pointer">Restock now</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const BarcodePrinting = () => (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="space-y-2 text-left">
                    <label className="text-sm font-bold text-gray-700 ml-1">Select Product</label>
                    <div className="relative">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none">
                            <option>Product A - SKU001</option>
                            <option>Product B - SKU002</option>
                            <option>Product C - SKU003</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2 text-left">
                    <label className="text-sm font-bold text-gray-700 ml-1">Number of Labels</label>
                    <div className="relative">
                        <Printer className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="number" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium" defaultValue="10" />
                    </div>
                </div>
                <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Printer size={18} />
                    <span>Print Labels Now</span>
                </button>
            </div>

            <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl mb-6 transform hover:scale-105 transition-transform">
                    <div className="text-[10px] font-bold text-gray-400 mb-1 tracking-widest">SKU001</div>
                    <div className="h-16 w-48 bg-gradient-to-r from-black via-white to-black bg-[length:6px_100%] rounded"></div>
                    <div className="text-xs font-bold text-gray-900 mt-2">Product A Name</div>
                </div>
                <p className="text-gray-400 text-sm font-medium italic">Label Preview</p>
            </div>
        </div>
    </div>
);

export default Inventory;
