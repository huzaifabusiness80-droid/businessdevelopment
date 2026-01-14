import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, Truck, ShoppingCart, Users, Building2,
    Receipt, BarChart3, UserCog, Settings, LogOut, Search, Bell, Mail, ChevronRight
} from 'lucide-react';

// Define all menu items with their permission keys
const ALL_MENU_ITEMS = [
    { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { key: 'inventory', icon: Package, label: 'Inventory', path: '/inventory' },
    { key: 'purchase', icon: Truck, label: 'Purchase', path: '/purchase' },
    { key: 'sales', icon: ShoppingCart, label: 'Sales', path: '/sales' },
    { key: 'customers', icon: Users, label: 'Customers', path: '/customers' },
    { key: 'suppliers', icon: Building2, label: 'Suppliers', path: '/suppliers' },
    { key: 'expenses', icon: Receipt, label: 'Expenses', path: '/expenses' },
    { key: 'reports', icon: BarChart3, label: 'Reports', path: '/reports' },
];

const SETTINGS_MENU_ITEMS = [
    { key: 'users', icon: UserCog, label: 'Company & Users', path: '/company' },
    { key: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

const SidebarItem = ({ icon: Icon, label, active, onClick, hasSubmenu }) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${active
            ? 'bg-emerald-50 text-emerald-700 font-semibold'
            : 'text-gray-600 hover:bg-gray-100'
            }`}
    >
        <div className="flex items-center space-x-3">
            <Icon size={20} className={active ? 'text-emerald-600' : 'text-gray-400'} />
            <span className="text-[17px]">{label}</span>
        </div>
        {hasSubmenu && <ChevronRight size={16} className="text-gray-400" />}
    </div>
);

const Layout = ({ children, user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [permissions, setPermissions] = useState([]);
    const [visibleMenuItems, setVisibleMenuItems] = useState([]);
    const [visibleSettingsItems, setVisibleSettingsItems] = useState([]);

    useEffect(() => {
        // Load permissions from sessionStorage
        const savedPermissions = sessionStorage.getItem('permissions');
        if (savedPermissions) {
            try {
                const perms = JSON.parse(savedPermissions);
                setPermissions(perms);
            } catch (err) {
                console.error('Failed to parse permissions:', err);
            }
        }
    }, []);

    useEffect(() => {
        // Filter menu items based on permissions
        const isSuperAdmin = user?.role?.toLowerCase() === 'super_admin' || user?.role === 'Super Admin';
        const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role === 'Admin';

        if (isSuperAdmin || isAdmin) {
            // Super admin and admin see all
            setVisibleMenuItems(ALL_MENU_ITEMS);
            setVisibleSettingsItems(SETTINGS_MENU_ITEMS);
        } else if (permissions.length > 0) {
            // Filter based on can_view permission
            const allowedKeys = permissions
                .filter(p => p.can_view === 1)
                .map(p => p.module);

            const filteredMenu = ALL_MENU_ITEMS.filter(item =>
                allowedKeys.includes(item.key)
            );
            const filteredSettings = SETTINGS_MENU_ITEMS.filter(item =>
                allowedKeys.includes(item.key)
            );

            setVisibleMenuItems(filteredMenu);
            setVisibleSettingsItems(filteredSettings);
        } else {
            // No permissions loaded yet, show all (fallback)
            setVisibleMenuItems(ALL_MENU_ITEMS);
            setVisibleSettingsItems(SETTINGS_MENU_ITEMS);
        }
    }, [permissions, user]);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-slate-100">
            {/* Sidebar */}
            <div className="w-64 bg-white flex flex-col border-r border-gray-200">
                {/* Logo */}
                <div className="h-16 flex items-center px-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">D</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">Dynamics</span>
                    </div>
                </div>

                {/* Menu Label */}
                {visibleMenuItems.length > 0 && (
                    <div className="px-6 py-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</span>
                    </div>
                )}

                {/* Navigation - Dynamic based on permissions */}
                <div className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {visibleMenuItems.map((item) => (
                        <SidebarItem
                            key={item.key}
                            icon={item.icon}
                            label={item.label}
                            active={isActive(item.path)}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </div>

                {/* Settings Section - Dynamic based on permissions */}
                {visibleSettingsItems.length > 0 && (
                    <div className="px-4 py-4 border-t border-gray-100">
                        <div className="px-2 py-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Settings</span>
                        </div>
                        {visibleSettingsItems.map((item) => (
                            <SidebarItem
                                key={item.key}
                                icon={item.icon}
                                label={item.label}
                                active={isActive(item.path)}
                                onClick={() => navigate(item.path)}
                            />
                        ))}
                        <div
                            onClick={onLogout}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer text-red-500 hover:bg-red-50 transition-colors mt-2"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-medium">Logout</span>
                        </div>
                    </div>
                )}

                {/* Always show logout even if no settings items */}
                {visibleSettingsItems.length === 0 && (
                    <div className="px-4 py-4 border-t border-gray-100">
                        <div
                            onClick={onLogout}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-medium">Logout</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    {/* Search */}
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search here..."
                            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300"
                        />
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                            <Mail size={20} />
                        </button>
                        <button className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                                {user?.fullname?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">{user?.fullname || 'User'}</p>
                                <p className="text-xs text-gray-400 capitalize">{user?.role?.replace('_', ' ') || 'User'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
