import React from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Menu, Bell, Grid, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-primary text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </div>
);

const Layout = ({ children, user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-slate-800 flex flex-col shadow-xl z-20">
                <div className="h-16 flex items-center px-6 border-b border-slate-700 shadow-sm">
                    <div className="flex items-center space-x-2 text-white font-bold text-lg">
                        <LayoutDashboard className="text-primary" />
                        <span>BMS</span>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    <div className="px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Main</div>
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={isActive('/')}
                        onClick={() => navigate('/')}
                    />
                    <SidebarItem
                        icon={ShoppingCart}
                        label="Sales"
                        active={isActive('/sales')}
                        onClick={() => navigate('/sales')}
                    />
                    <SidebarItem
                        icon={Package}
                        label="Inventory"
                        active={isActive('/inventory')}
                        onClick={() => navigate('/inventory')}
                    />
                    <SidebarItem
                        icon={Users}
                        label="Customers"
                        active={isActive('/customers')}
                        onClick={() => navigate('/customers')}
                    />
                    <SidebarItem
                        icon={BarChart3}
                        label="Reports"
                        active={isActive('/reports')}
                        onClick={() => navigate('/reports')}
                    />
                </div>

                <div className="p-4 border-t border-slate-700">
                    <div
                        onClick={onLogout}
                        className="flex items-center space-x-3 text-slate-400 p-2 hover:text-white cursor-pointer transition-colors rounded-lg hover:bg-slate-700"
                    >
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <Menu size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 hidden md:block">Business Management System</h1>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 relative">
                                <Bell size={20} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
                                <Grid size={20} />
                            </button>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex items-center space-x-3 cursor-pointer">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gray-700">Welcome, {user?.fullname || 'User'}!</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ') || 'User'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-gray-200">
                                {user?.fullname?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100/50 p-6">
                    <div className="max-w-8xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
