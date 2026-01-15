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
        className={`group relative flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 ${active
            ? 'bg-gradient-to-r from-orange-300 to-orange-600 text-white font-semibold '
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
    >
        {active && <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl blur opacity-50"></div>}
        <div className="relative flex items-center space-x-3">
            <Icon size={20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-orange-400 transition-colors'} />
            <span className="text-[15px]">{label}</span>
        </div>
        {hasSubmenu && <ChevronRight size={16} className="relative text-gray-500 group-hover:text-orange-400 transition-colors" />}
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
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-72 bg-gradient-to-b from-gray-900 via-black to-gray-900 flex flex-col relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl"></div>

                {/* Logo */}
                <div className="relative h-20 flex items-center px-6 border-b border-gray-800">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl blur-md opacity-60"></div>
                            <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">B</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Business</span>
                            <p className="text-xs text-orange-400 font-medium">Management</p>
                        </div>
                    </div>
                </div>

                {/* Menu Label */}
                {visibleMenuItems.length > 0 && (
                    <div className="relative px-6 py-4 mt-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Main Menu</span>
                    </div>
                )}

                {/* Navigation - Dynamic based on permissions */}
                <div className="relative flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
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
                    <div className="relative px-4 py-4 border-t border-gray-800">
                        <div className="px-2 py-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Settings</span>
                        </div>
                        <div className="space-y-1.5">
                            {visibleSettingsItems.map((item) => (
                                <SidebarItem
                                    key={item.key}
                                    icon={item.icon}
                                    label={item.label}
                                    active={isActive(item.path)}
                                    onClick={() => navigate(item.path)}
                                />
                            ))}
                        </div>
                        <div
                            onClick={onLogout}
                            className="group flex items-center space-x-3 px-4 py-3.5 rounded-xl cursor-pointer text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-300 mt-3 border border-red-500/20 hover:border-red-500/40"
                        >
                            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-sm font-medium">Logout</span>
                        </div>
                    </div>
                )}

                {/* Always show logout even if no settings items */}
                {visibleSettingsItems.length === 0 && (
                    <div className="relative px-4 py-4 border-t border-gray-800">
                        <div
                            onClick={onLogout}
                            className="group flex items-center space-x-3 px-4 py-3.5 rounded-xl cursor-pointer text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
                        >
                            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-sm font-medium">Logout</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
                    {/* Search */}
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                        />
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-3">
                        <button className="p-3 bg-gray-50 rounded-xl text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300">
                            <Mail size={20} />
                        </button>
                        <button className="p-3 bg-gray-50 rounded-xl text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>
                        <div className="flex items-center space-x-3 pl-4 ml-2 border-l border-gray-200">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full blur-md opacity-40"></div>
                                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg">
                                    {user?.fullname?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{user?.fullname || 'User'}</p>
                                <p className="text-xs font-medium text-orange-500 capitalize">{user?.role?.replace('_', ' ') || 'User'}</p>
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
