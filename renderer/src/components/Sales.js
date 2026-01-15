import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus, Search, MoreHorizontal, X, ShoppingCart,
    Trash2, DollarSign, TrendingUp, Calendar,
    User, Package, ChevronRight, Check, Printer
} from 'lucide-react';

// Premium Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        orange: 'from-orange-500 to-orange-600 shadow-orange-200',
        emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200',
        blue: 'from-blue-500 to-blue-600 shadow-blue-200',
        purple: 'from-purple-500 to-purple-600 shadow-purple-200',
        red: 'from-red-500 to-red-600 shadow-red-200',
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
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md transition-transform group-hover:rotate-12">
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

const Sales = ({ currentUser }) => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // New Sale Cart State
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [qty, setQty] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [discount, setDiscount] = useState(0);

    useEffect(() => { fetchData(); }, [currentUser]);

    const fetchData = async () => {
        if (currentUser?.company_id) {
            setLoading(true);
            const fetchedSales = await window.electronAPI.getSales(currentUser.company_id);
            const fetchedProducts = await window.electronAPI.getProducts(currentUser.company_id);
            const fetchedCustomers = await window.electronAPI.getCustomers(currentUser.company_id);
            setSales(fetchedSales || []);
            setProducts(fetchedProducts || []);
            setCustomers(fetchedCustomers || []);
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const today = new Date().toLocaleDateString();
        const todaySales = sales.filter(s => new Date(s.date).toLocaleDateString() === today);
        return {
            todayCount: todaySales.length,
            todayRevenue: todaySales.reduce((acc, s) => acc + s.grandTotal, 0),
            totalRevenue: sales.reduce((acc, s) => acc + s.grandTotal, 0),
            avgTicket: sales.length ? (sales.reduce((acc, s) => acc + s.grandTotal, 0) / sales.length).toFixed(0) : 0
        };
    }, [sales]);

    // Cart Logic
    const addToCart = () => {
        if (!selectedProduct) return;
        const product = products.find(p => p.id === selectedProduct);
        if (!product) return;

        if (product.stockQty < qty) {
            alert(`Insufficient Stock! Available: ${product.stockQty}`);
            return;
        }

        const existingItem = cart.find(item => item.productId === product.id);
        if (existingItem) {
            setCart(cart.map(item => item.productId === product.id ? {
                ...item,
                quantity: item.quantity + parseInt(qty),
                total: (item.quantity + parseInt(qty)) * product.sellPrice
            } : item));
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

    const subTotal = cart.reduce((sum, item) => sum + item.total, 0);
    const grandTotal = subTotal - parseFloat(discount || 0);

    const handleSaveSale = async () => {
        if (cart.length === 0) return alert("Please add items to cart!");

        const saleData = {
            companyId: currentUser.company_id,
            customerId: selectedCustomer || null,
            userId: currentUser.id,
            invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
            subTotal,
            discount: parseFloat(discount),
            tax: 0,
            grandTotal,
            items: cart
        };

        const result = await window.electronAPI.addSale(saleData);
        if (result.success) {
            setIsModalOpen(false);
            setCart([]);
            setDiscount(0);
            setSelectedCustomer('');
            fetchData();
        } else {
            alert("Error: " + result.message);
        }
    };

    const filteredSales = sales.filter(s =>
        s.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Today's Revenue" value={`PKR ${stats.todayRevenue.toLocaleString()}`} icon={DollarSign} color="orange" />
                <StatCard title="Today's Orders" value={stats.todayCount} icon={ShoppingCart} color="emerald" />
                <StatCard title="Total Revenue" value={`PKR ${stats.totalRevenue.toLocaleString()}`} icon={TrendingUp} color="blue" />
                <StatCard title="Avg. Order Value" value={`PKR ${stats.avgTicket.toLocaleString()}`} icon={Calendar} color="purple" />
            </div>

            {/* Sales Table Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/50 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/30">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-4 bg-white border border-transparent rounded-[1.5rem] text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-sm transition-all"
                            placeholder="Find invoice by number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center space-x-2 px-8 py-4 bg-orange-500 text-white rounded-[1.5rem] font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Create New Sale</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Invoice Details</th>
                                <th className="px-8 py-5">Customer info</th>
                                <th className="px-8 py-5">Items</th>
                                <th className="px-8 py-5">Grand Total</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-orange-50/20 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{sale.invoiceNo}</div>
                                        <div className="text-xs text-gray-400 font-medium">{new Date(sale.date).toLocaleString()}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                                                <User size={14} />
                                            </div>
                                            <span className="font-bold text-gray-700">{sale.customer?.name || 'Walk-in Customer'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">
                                            {sale.items?.length || 0} Products
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-gray-900">PKR {sale.grandTotal?.toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            <span>Paid</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSales.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center">
                                        <ShoppingCart size={48} className="mx-auto text-gray-100 mb-4" />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No sales recorded yet</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Professional POS Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#F8FAFC] rounded-[3.5rem] shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/20">
                        {/* Header */}
                        <div className="px-10 py-6 bg-white border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-100">
                                    <ShoppingCart size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Terminal POS</h2>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Operator: {currentUser?.fullname || 'Counter 1'}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-4 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-3xl transition-all text-gray-400 border border-transparent hover:border-red-100">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Left: Product Selection */}
                            <div className="flex-1 p-8 overflow-y-auto space-y-8 scrollbar-hide border-r border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Search Product</label>
                                        <div className="relative">
                                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <select
                                                className="w-full pl-12 pr-4 py-4 bg-white border border-transparent rounded-[1.5rem] focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 shadow-sm transition-all font-bold outline-none appearance-none cursor-pointer"
                                                value={selectedProduct}
                                                onChange={(e) => setSelectedProduct(e.target.value)}
                                            >
                                                <option value="">Choose item...</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id} disabled={p.stockQty <= 0}>
                                                        {p.name} - (Stock: {p.stockQty}) - PKR {p.sellPrice}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Quantity</label>
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-full px-4 py-4 bg-white border border-transparent rounded-[1.5rem] focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 shadow-sm transition-all font-bold outline-none text-center"
                                                value={qty}
                                                onChange={(e) => setQty(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                onClick={addToCart}
                                                className="w-full py-4 bg-blue-600 text-white rounded-[1.5rem] font-black hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                                            >
                                                ADD TO CART
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Modern Cart Table */}
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                            <tr>
                                                <th className="px-8 py-5">Product</th>
                                                <th className="px-8 py-5 text-center">Unit Price</th>
                                                <th className="px-8 py-5 text-center">Qty</th>
                                                <th className="px-8 py-5 text-right">Total</th>
                                                <th className="px-8 py-5 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {cart.map((item, idx) => (
                                                <tr key={idx} className="group hover:bg-gray-50/50 transition-all">
                                                    <td className="px-8 py-5">
                                                        <div className="font-bold text-gray-900">{item.name}</div>
                                                        <div className="text-[10px] text-gray-400">SKU: {item.sku || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-8 py-5 text-center font-bold text-gray-600">PKR {item.price.toLocaleString()}</td>
                                                    <td className="px-8 py-5">
                                                        <div className="w-20 mx-auto px-3 py-1.5 bg-gray-100 rounded-xl text-center font-black text-xs text-gray-900 border border-gray-200">
                                                            {item.quantity}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right font-black text-gray-900">PKR {item.total.toLocaleString()}</td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button onClick={() => removeFromCart(item.productId)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {cart.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-8 py-20 text-center">
                                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                                                            <ShoppingCart size={32} className="text-gray-300" />
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Cart is empty</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Right: Summary & Checkout */}
                            <div className="w-[400px] p-8 flex flex-col space-y-8 bg-white border-l border-gray-100">
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4">
                                        <div className="flex items-center gap-3 mb-2 px-1">
                                            <User size={18} className="text-orange-500" />
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Customer Details</span>
                                        </div>
                                        <select
                                            className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:border-orange-500 transition-all outline-none font-bold text-sm shadow-sm appearance-none"
                                            value={selectedCustomer}
                                            onChange={(e) => setSelectedCustomer(e.target.value)}
                                        >
                                            <option value="">Walk-in Customer</option>
                                            {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-4 px-2">
                                        <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                            <span>Subtotal</span>
                                            <span className="text-gray-900 font-black">PKR {subTotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                            <span>Discount Amount</span>
                                            <div className="relative w-32">
                                                <input
                                                    type="number"
                                                    className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-xl text-right font-black text-orange-600 focus:bg-white focus:border-orange-500 outline-none transition-all"
                                                    value={discount}
                                                    onChange={(e) => setDiscount(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="h-px bg-gray-100 my-6"></div>
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] block">Grand Total</span>
                                                <span className="text-4xl font-black text-emerald-600 tracking-tighter italic">
                                                    <span className="text-lg mr-1 not-italic">PKR</span>
                                                    {grandTotal.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                                <TrendingUp size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                                            <Printer size={18} />
                                            HOLD
                                        </button>
                                        <button className="py-4 bg-orange-100 text-orange-600 font-black rounded-2xl hover:bg-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                                            DISCOUNT
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleSaveSale}
                                        disabled={cart.length === 0}
                                        className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-xl hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                                    >
                                        <ShoppingCart size={28} />
                                        CHECKOUT NOW
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
