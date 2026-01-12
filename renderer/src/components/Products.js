import React from 'react';
import { Plus, Search, Edit, Trash2, MoreHorizontal } from 'lucide-react';

const Products = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <button className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-sm">
                    <Plus size={18} />
                    <span>Add Product</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100" placeholder="Search products..." />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Buy Price</th>
                                <th className="px-6 py-4">Sell Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { name: 'Product A', sku: 'SKU001', buy: 500, sell: 750, stock: 25, status: 'Active' },
                                { name: 'Product B', sku: 'SKU002', buy: 100, sell: 150, stock: 5, status: 'Low Stock' },
                                { name: 'Product C', sku: 'SKU003', buy: 1000, sell: 1500, stock: 12, status: 'Active' },
                                { name: 'Product D', sku: 'SKU004', buy: 200, sell: 300, stock: 0, status: 'Out of Stock' },
                            ].map((product, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-700">{product.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{product.sku}</td>
                                    <td className="px-6 py-4 text-gray-600">PKR {product.buy}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">PKR {product.sell}</td>
                                    <td className="px-6 py-4">{product.stock}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center space-x-1 text-xs font-medium ${product.status === 'Active' ? 'text-emerald-600' :
                                                product.status === 'Low Stock' ? 'text-orange-500' : 'text-red-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'Active' ? 'bg-emerald-500' :
                                                    product.status === 'Low Stock' ? 'bg-orange-500' : 'bg-red-500'
                                                }`}></span>
                                            <span>{product.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Products;
