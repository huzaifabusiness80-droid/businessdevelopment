import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, X, ShoppingCart, Trash2 } from 'lucide-react';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // New Sale Cart State
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [qty, setQty] = useState(1);
    const [customerName, setCustomerName] = useState('Walk-in Customer');
    const [discount, setDiscount] = useState(0);
    const [taxRate, setTaxRate] = useState(0);

    const currentUser = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        if (currentUser?.company_id) {
            const fetchedSales = await window.electronAPI.getSales(currentUser.company_id);
            const fetchedProducts = await window.electronAPI.getProducts(currentUser.company_id);
            setSales(fetchedSales || []);
            setProducts(fetchedProducts || []);
        }
    };

    // Cart Logic
    const addToCart = () => {
        if (!selectedProduct) return;
        const product = products.find(p => p.id === selectedProduct);
        if (!product) return;

        if (product.stockQty < qty) {
            alert(`Not enough stock! (Available: ${product.stockQty})`);
            return;
        }

        const existingItem = cart.find(item => item.productId === product.id);
        if (existingItem) {
            setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + parseInt(qty), total: (item.quantity + parseInt(qty)) * product.sellPrice } : item));
        } else {
            setCart([...cart, {
                productId: product.id,
                name: product.name,
                price: product.sellPrice,
                quantity: parseInt(qty),
                total: parseInt(qty) * product.sellPrice
            }]);
        }
        setQty(1);
        setSelectedProduct('');
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    // Calculations
    const subTotal = cart.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subTotal * taxRate) / 100;
    const grandTotal = subTotal + taxAmount - parseFloat(discount || 0);

    const handleSaveSale = async () => {
        if (cart.length === 0) return alert("Cart is empty!");

        const saleData = {
            companyId: currentUser.company_id,
            customerId: null, // TODO: Implement Customer selection
            userId: currentUser.id,
            invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
            subTotal,
            discount: parseFloat(discount),
            tax: taxAmount,
            grandTotal,
            items: cart
        };

        const result = await window.electronAPI.addSale(saleData);
        if (result.success) {
            setIsModalOpen(false);
            setCart([]);
            setDiscount(0);
            fetchData(); // Refresh list & stock
        } else {
            alert("Failed to save sale: " + result.message);
        }
    };

    const filteredSales = sales.filter(s =>
        s.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Sales</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-sm">
                    <Plus size={18} />
                    <span>New Sale</span>
                </button>
            </div>

            {/* Sales List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100"
                            placeholder="Search invoices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Invoice #</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-700">{sale.invoiceNo}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(sale.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-gray-600">{sale.items?.length || 0}</td>
                                    <td className="px-6 py-4 font-bold text-gray-700">PKR {sale.grandTotal?.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-emerald-600 font-medium">Completed</td>
                                </tr>
                            ))}
                            {filteredSales.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">No sales found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Sale Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">New Sale</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: Product Selection */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Product</label>
                                            <select
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm"
                                                value={selectedProduct}
                                                onChange={(e) => setSelectedProduct(e.target.value)}
                                            >
                                                <option value="">Select Product...</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name} - (Stock: {p.stockQty}) - PKR {p.sellPrice}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Qty</label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm"
                                                    value={qty}
                                                    onChange={(e) => setQty(e.target.value)}
                                                />
                                                <button
                                                    onClick={addToCart}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cart Items */}
                                <div className="border border-gray-100 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500">
                                            <tr>
                                                <th className="px-4 py-3">Product</th>
                                                <th className="px-4 py-3">Price</th>
                                                <th className="px-4 py-3">Qty</th>
                                                <th className="px-4 py-3">Total</th>
                                                <th className="px-4 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {cart.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3 font-medium text-gray-700">{item.name}</td>
                                                    <td className="px-4 py-3">{item.price}</td>
                                                    <td className="px-4 py-3">{item.quantity}</td>
                                                    <td className="px-4 py-3 font-semibold">{item.total}</td>
                                                    <td className="px-4 py-3">
                                                        <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {cart.length === 0 && (
                                                <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400">Cart is empty</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Right: Totals */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-5 rounded-xl space-y-4">
                                    <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2">Summary</h3>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-medium">PKR {subTotal.toLocaleString()}</span>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Discount</span>
                                        </div>
                                        <input
                                            type="number"
                                            className="w-full p-2 bg-white border border-gray-200 rounded text-right text-sm"
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                        />
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base font-bold text-gray-800">Grand Total</span>
                                            <span className="text-xl font-bold text-emerald-600">PKR {grandTotal.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSaveSale}
                                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                                    >
                                        Complete Sale
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

export default Sales;
