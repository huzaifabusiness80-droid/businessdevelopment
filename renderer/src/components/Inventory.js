import React, { useState, useEffect } from 'react';
import { Package, Grid, BarChart2, AlertTriangle, Printer, Plus, Search, Edit, Trash2, Image, X } from 'lucide-react';
import Products from './Products'; // Import the new dynamic Products component

const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories & Brands', icon: Grid },
    { id: 'stock', label: 'Stock Tracking', icon: BarChart2 },
    { id: 'alerts', label: 'Low Stock Alerts', icon: AlertTriangle },
    { id: 'barcode', label: 'Barcode Printing', icon: Printer },
];

const Inventory = () => {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
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
                    {activeTab === 'products' && <Products />}
                    {activeTab === 'categories' && <CategoriesBrands />}
                    {activeTab === 'stock' && <StockTracking />}
                    {activeTab === 'alerts' && <LowStockAlerts />}
                    {activeTab === 'barcode' && <BarcodePrinting />}
                </div>
            </div>
        </div>
    );
};

const CategoriesBrands = () => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [modalConfig, setModalConfig] = useState(null); // { type: 'category' | 'brand', item: null | object }
    const [name, setName] = useState('');

    const currentUser = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        if (currentUser?.company_id) {
            const fetchedCategories = await window.electronAPI.getCategories(currentUser.company_id);
            const fetchedBrands = await window.electronAPI.getBrands(currentUser.company_id);
            setCategories(fetchedCategories || []);
            setBrands(fetchedBrands || []);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const { type, item } = modalConfig;
        const payload = {
            id: item?.id,
            name,
            companyId: currentUser.company_id
        };

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
        if (!window.confirm(`Delete this ${type}?`)) return;

        let result;
        if (type === 'category') result = await window.electronAPI.deleteCategory(id);
        else result = await window.electronAPI.deleteBrand(id);

        if (result.success) fetchData();
        else alert("Error: " + result.message);
    };

    const openModal = (type, item = null) => {
        setModalConfig({ type, item });
        setName(item ? item.name : '');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories Column */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Categories</h3>
                    <button onClick={() => openModal('category')} className="flex items-center space-x-1 text-blue-600 text-sm hover:underline">
                        <Plus size={16} /><span>Add Category</span>
                    </button>
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                            <span className="font-medium text-gray-700">{cat.name}</span>
                            <div className="flex space-x-2">
                                <button onClick={() => openModal('category', cat)} className="text-gray-400 hover:text-blue-600"><Edit size={14} /></button>
                                <button onClick={() => handleDelete('category', cat.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && <p className="text-sm text-gray-400 italic">No categories added</p>}
                </div>
            </div>

            {/* Brands Column */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Brands</h3>
                    <button onClick={() => openModal('brand')} className="flex items-center space-x-1 text-blue-600 text-sm hover:underline">
                        <Plus size={16} /><span>Add Brand</span>
                    </button>
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                            <span className="font-medium text-gray-700">{brand.name}</span>
                            <div className="flex space-x-2">
                                <button onClick={() => openModal('brand', brand)} className="text-gray-400 hover:text-blue-600"><Edit size={14} /></button>
                                <button onClick={() => handleDelete('brand', brand.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                    {brands.length === 0 && <p className="text-sm text-gray-400 italic">No brands added</p>}
                </div>
            </div>

            {/* Modal */}
            {modalConfig && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">
                                {modalConfig.item ? 'Edit' : 'Add'} {modalConfig.type === 'category' ? 'Category' : 'Brand'}
                            </h3>
                            <button onClick={() => setModalConfig(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={`Enter ${modalConfig.type} name...`}
                                />
                            </div>
                            <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StockTracking = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">156</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-gray-500">In Stock</p>
                <p className="text-2xl font-bold text-green-600">142</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-red-600">8</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-800">6</p>
            </div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-gray-800 mb-2">Stock Adjustment</h4>
            <p className="text-sm text-gray-600 mb-3">Manually correct stock for damages or losses</p>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600">New Adjustment</button>
        </div>
    </div>
);

const LowStockAlerts = () => (
    <div className="space-y-4">
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-600">8 items are below the minimum stock threshold</p>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Current Stock</th>
                        <th className="px-6 py-4">Min Threshold</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[
                        { name: 'Product B', stock: 5, min: 10 },
                        { name: 'Product D', stock: 3, min: 15 },
                        { name: 'Product F', stock: 2, min: 20 },
                    ].map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{item.name}</td>
                            <td className="px-6 py-4 text-red-600 font-bold">{item.stock}</td>
                            <td className="px-6 py-4">{item.min}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Low Stock</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const BarcodePrinting = () => (
    <div className="space-y-4">
        <p className="text-gray-600">Generate and print barcode labels for your products.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg">
                    <option>Product A - SKU001</option>
                    <option>Product B - SKU002</option>
                    <option>Product C - SKU003</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Labels</label>
                <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-lg" defaultValue="10" />
            </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <div className="inline-block p-4 bg-white rounded border mb-2">
                <div className="text-xs text-gray-500 mb-1">SKU001</div>
                <div className="h-12 bg-gradient-to-r from-black via-white to-black bg-[length:4px_100%]"></div>
                <div className="text-xs mt-1">Product A</div>
            </div>
            <p className="text-sm text-gray-500">Barcode Preview</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            <Printer size={18} />
            <span>Print Labels</span>
        </button>
    </div>
);

export default Inventory;
