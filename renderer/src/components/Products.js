import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        sku: '',
        cost_price: 0,
        sell_price: 0,
        stock_qty: 0,
        alert_qty: 5,
        category_id: '',
        brand_id: ''
    });

    const currentUser = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        if (currentUser?.company_id) {
            const fetchedProducts = await window.electronAPI.getProducts(currentUser.company_id);
            const fetchedCategories = await window.electronAPI.getCategories(currentUser.company_id);
            const fetchedBrands = await window.electronAPI.getBrands(currentUser.company_id);

            setProducts(fetchedProducts || []);
            setCategories(fetchedCategories || []);
            setBrands(fetchedBrands || []);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            companyId: currentUser.company_id
        };

        let result;
        if (formData.id) {
            result = await window.electronAPI.updateProduct(payload);
        } else {
            result = await window.electronAPI.createProduct(payload);
        }

        if (result.success) {
            setIsModalOpen(false);
            setFormData({
                id: null, name: '', sku: '', cost_price: 0, sell_price: 0,
                stock_qty: 0, alert_qty: 5, category_id: '', brand_id: ''
            });
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
            id: product.id,
            name: product.name,
            sku: product.sku,
            cost_price: product.costPrice,
            sell_price: product.sellPrice,
            stock_qty: product.stockQty,
            alert_qty: product.alertQty,
            category_id: product.categoryId || '',
            brand_id: product.brandId || ''
        });
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <button
                    onClick={() => {
                        setFormData({ id: null, name: '', sku: '', cost_price: 0, sell_price: 0, stock_qty: 0, alert_qty: 5, category_id: '', brand_id: '' });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Add Product</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Cost</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        {product.name}
                                        <div className="text-xs text-gray-400">{product.brand?.name} • {product.category?.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{product.sku}</td>
                                    <td className="px-6 py-4 text-gray-600">PKR {product.costPrice}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">PKR {product.sellPrice}</td>
                                    <td className="px-6 py-4">{product.stockQty}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center space-x-1 text-xs font-medium ${product.stockQty > product.alertQty ? 'text-emerald-600' :
                                            product.stockQty > 0 ? 'text-orange-500' : 'text-red-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${product.stockQty > product.alertQty ? 'bg-emerald-500' :
                                                product.stockQty > 0 ? 'bg-orange-500' : 'bg-red-500'
                                                }`}></span>
                                            <span>
                                                {product.stockQty > product.alertQty ? 'Active' :
                                                    product.stockQty > 0 ? 'Low Stock' : 'Out of Stock'}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button onClick={() => openEdit(product)} className="text-blue-400 hover:text-blue-600"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input required type="text" className="w-full p-2.5 border rounded-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                    <input type="text" className="w-full p-2.5 border rounded-lg" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select className="w-full p-2.5 border rounded-lg" value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                    <select className="w-full p-2.5 border rounded-lg" value={formData.brand_id} onChange={e => setFormData({ ...formData, brand_id: e.target.value })}>
                                        <option value="">Select Brand</option>
                                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
                                    <input type="number" className="w-full p-2.5 border rounded-lg" value={formData.cost_price} onChange={e => setFormData({ ...formData, cost_price: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                                    <input required type="number" className="w-full p-2.5 border rounded-lg" value={formData.sell_price} onChange={e => setFormData({ ...formData, sell_price: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                    <input required type="number" className="w-full p-2.5 border rounded-lg" value={formData.stock_qty} onChange={e => setFormData({ ...formData, stock_qty: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
                                    <input type="number" className="w-full p-2.5 border rounded-lg" value={formData.alert_qty} onChange={e => setFormData({ ...formData, alert_qty: e.target.value })} />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">
                                {formData.id ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
