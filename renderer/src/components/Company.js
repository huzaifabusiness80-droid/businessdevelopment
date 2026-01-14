import React, { useState, useEffect } from 'react';
import { Building2, Users, Shield, ClipboardList, Plus, Search, Edit2, Trash2, X, Eye, EyeOff, Check, ChevronDown } from 'lucide-react';

const tabs = [
    { id: 'profile', label: 'Company Profile', icon: Building2 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'audit', label: 'Audit Log', icon: ClipboardList },
];

const MODULES = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'sales', label: 'Sales' },
    { key: 'purchase', label: 'Purchase' },
    { key: 'products', label: 'Products' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'customers', label: 'Customers' },
    { key: 'suppliers', label: 'Suppliers' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'reports', label: 'Reports' },
    { key: 'users', label: 'Users' },
    { key: 'settings', label: 'Settings' },
];

const Company = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) setCurrentUser(JSON.parse(savedUser));
    }, []);

    const isSuperAdmin = currentUser?.role?.toLowerCase() === 'super_admin' || currentUser?.role === 'Super Admin';

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Company & Users</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your company settings and team</p>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100 bg-gray-50/50">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const label = (tab.id === 'profile' && isSuperAdmin) ? 'Companies' : tab.label;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${activeTab === tab.id
                                    ? 'text-emerald-600 bg-white'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                    }`}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'profile' && <CompanyProfile currentUser={currentUser} isSuperAdmin={isSuperAdmin} />}
                    {activeTab === 'users' && <UserManagement currentUser={currentUser} isSuperAdmin={isSuperAdmin} />}
                    {activeTab === 'roles' && <RolesPermissions currentUser={currentUser} />}
                    {activeTab === 'audit' && <AuditLog currentUser={currentUser} />}
                </div>
            </div>
        </div>
    );
};

// ============ COMPANY PROFILE ============
const CompanyProfile = ({ currentUser, isSuperAdmin }) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', address: '', phone: '', email: '', tax_no: '', currency_symbol: 'PKR'
    });

    useEffect(() => { loadData(); }, [currentUser, isSuperAdmin]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (window.electronAPI) {
                if (isSuperAdmin) {
                    const data = await window.electronAPI.getCompanies();
                    setCompanies(data || []);
                } else if (currentUser?.company_id) {
                    const data = await window.electronAPI.getCompany(currentUser.company_id);
                    if (data) setFormData(data);
                }
            }
        } catch (err) {
            window.alert('Error: ' + err.message);
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (window.electronAPI) {
                const result = formData.id
                    ? await window.electronAPI.updateCompany(formData)
                    : await window.electronAPI.createCompany(formData);
                if (result?.success === false) {
                    window.alert(result.message);
                } else {
                    setShowModal(false);
                    loadData();
                }
            }
        } catch (err) {
            window.alert('Error: ' + err.message);
        }
        setSaving(false);
    };

    const openModal = (comp = null) => {
        setFormData(comp || { name: '', address: '', phone: '', email: '', tax_no: '', currency_symbol: 'PKR' });
        setShowModal(true);
    };

    if (loading) return <LoadingSpinner />;

    // Super Admin View - Companies List
    if (isSuperAdmin) {
        return (
            <>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">All Companies</h2>
                        <p className="text-sm text-gray-500">{companies.length} companies registered</p>
                    </div>
                    <Button onClick={() => openModal()} icon={Plus}>Add Company</Button>
                </div>

                <div className="grid gap-4">
                    {companies.map((c) => (
                        <div key={c.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-200">
                                    {c.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{c.name}</h3>
                                    <p className="text-sm text-gray-500">{c.email || c.phone || 'No contact info'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <StatusBadge active={c.is_active} />
                                <button onClick={() => openModal(c)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                    <Edit2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {companies.length === 0 && <EmptyState message="No companies found" />}
                </div>

                {showModal && (
                    <Modal title={formData.id ? 'Edit Company' : 'New Company'} onClose={() => setShowModal(false)}>
                        <form onSubmit={handleSave} className="space-y-5">
                            <FormInput label="Company Name" required value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="Enter company name" />
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Email" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} placeholder="email@company.com" />
                                <FormInput label="Phone" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} placeholder="+92 300 1234567" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Tax/NTN No" value={formData.tax_no} onChange={v => setFormData({ ...formData, tax_no: v })} />
                                <FormInput label="Currency" value={formData.currency_symbol} onChange={v => setFormData({ ...formData, currency_symbol: v })} />
                            </div>
                            <FormTextarea label="Address" value={formData.address} onChange={v => setFormData({ ...formData, address: v })} placeholder="Full address..." />
                            <ModalFooter onCancel={() => setShowModal(false)} saving={saving} />
                        </form>
                    </Modal>
                )}
            </>
        );
    }

    // Admin View - Edit Own Company
    return (
        <form onSubmit={handleSave} className="max-w-2xl space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-200">
                    {formData.name?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{formData.name || 'Your Company'}</h2>
                    <p className="text-sm text-gray-500">Update your company information</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <FormInput label="Company Name" required value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                <FormInput label="Tax/NTN Number" value={formData.tax_no} onChange={v => setFormData({ ...formData, tax_no: v })} />
            </div>
            <div className="grid grid-cols-2 gap-5">
                <FormInput label="Phone" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} placeholder="+92 300 1234567" />
                <FormInput label="Email" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} placeholder="email@company.com" />
            </div>
            <FormTextarea label="Address" value={formData.address} onChange={v => setFormData({ ...formData, address: v })} rows={3} />

            <Button type="submit" disabled={saving} className="mt-4">
                {saving ? 'Saving...' : 'Save Changes'}
            </Button>
        </form>
    );
};

// ============ USER MANAGEMENT ============
const UserManagement = ({ currentUser, isSuperAdmin }) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => { loadData(); }, [currentUser, isSuperAdmin]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (window.electronAPI) {
                const companyId = isSuperAdmin ? null : currentUser?.company_id;
                const [usersData, rolesData] = await Promise.all([
                    window.electronAPI.getUsers(companyId),
                    window.electronAPI.getRoles(companyId)
                ]);
                setUsers(usersData || []);
                setRoles(rolesData || []);
                if (isSuperAdmin) {
                    setCompanies(await window.electronAPI.getCompanies() || []);
                }
            }
        } catch (err) {
            window.alert('Error: ' + err.message);
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = { ...formData, company_id: isSuperAdmin ? formData.company_id : currentUser?.company_id };
            const result = formData.id
                ? await window.electronAPI.updateUser(data)
                : await window.electronAPI.createUser(data);
            if (result?.success === false) {
                window.alert(result.message);
            } else {
                setShowModal(false);
                loadData();
            }
        } catch (err) {
            window.alert('Error: ' + err.message);
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to deactivate this user?')) return;
        await window.electronAPI.deleteUser(id);
        loadData();
    };

    const openModal = (user = null) => {
        setFormData(user ? { ...user, password: '' } : {
            company_id: currentUser?.company_id || '', username: '', password: '', role: 'admin', fullname: '', is_active: 1
        });
        setShowPassword(false);
        setShowModal(true);
    };

    const filtered = users.filter(u =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.fullname?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2.5 w-72 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                    />
                </div>
                <Button onClick={() => openModal()} icon={Plus}>Add User</Button>
            </div>

            <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4">User</th>
                            {isSuperAdmin && <th className="px-6 py-4">Company</th>}
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filtered.map((user) => (
                            <tr key={user.id} className="hover:bg-emerald-50/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                            {user.fullname?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{user.fullname}</p>
                                            <p className="text-sm text-gray-500">@{user.username}</p>
                                        </div>
                                    </div>
                                </td>
                                {isSuperAdmin && <td className="px-6 py-4 text-gray-600">{user.company_name || 'System'}</td>}
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium capitalize">
                                        {user.role?.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge active={user.is_active} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openModal(user)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={isSuperAdmin ? 5 : 4} className="px-6 py-12"><EmptyState message="No users found" /></td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <Modal title={formData.id ? 'Edit User' : 'New User'} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSave} className="space-y-5">
                        {isSuperAdmin && (
                            <FormSelect label="Company" required value={formData.company_id} onChange={v => setFormData({ ...formData, company_id: v })} options={companies.map(c => ({ value: c.id, label: c.name }))} placeholder="Select company" />
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Full Name" required value={formData.fullname} onChange={v => setFormData({ ...formData, fullname: v })} />
                            <FormInput label="Username" required value={formData.username} onChange={v => setFormData({ ...formData, username: v })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <FormInput
                                    label={formData.id ? "Password (optional)" : "Password"}
                                    type={showPassword ? 'text' : 'password'}
                                    required={!formData.id}
                                    value={formData.password}
                                    onChange={v => setFormData({ ...formData, password: v })}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <FormSelect label="Role" required value={formData.role} onChange={v => setFormData({ ...formData, role: v })} options={roles.map(r => ({ value: r.name.toLowerCase().replace(' ', '_'), label: r.name }))} />
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={formData.is_active === 1} onChange={e => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })} className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            <span className="text-sm text-gray-700">Active user account</span>
                        </label>
                        <ModalFooter onCancel={() => setShowModal(false)} saving={saving} />
                    </form>
                </Modal>
            )}
        </>
    );
};

// ============ ROLES & PERMISSIONS ============
const RolesPermissions = ({ currentUser }) => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', permissions: [] });

    useEffect(() => { loadRoles(); }, [currentUser]);

    const loadRoles = async () => {
        setLoading(true);
        try {
            if (window.electronAPI) {
                const data = await window.electronAPI.getRoles(currentUser?.company_id);
                const rolesWithPerms = await Promise.all((data || []).map(async (role) => ({
                    ...role,
                    permissions: await window.electronAPI.getPermissions(role.id) || []
                })));
                setRoles(rolesWithPerms);
            }
        } catch (err) {
            window.alert('Error: ' + err.message);
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = { ...formData, company_id: currentUser?.company_id };
            formData.id ? await window.electronAPI.updateRole(data) : await window.electronAPI.createRole(data);
            setShowModal(false);
            loadRoles();
        } catch (err) {
            window.alert('Error: ' + err.message);
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this role?')) return;
        await window.electronAPI.deleteRole(id);
        loadRoles();
    };

    const openModal = (role = null) => {
        setFormData(role ? { ...role, permissions: role.permissions || [] } : {
            name: '', description: '',
            permissions: MODULES.map(m => ({ module: m.key, can_view: 1, can_create: 0, can_edit: 0, can_delete: 0 }))
        });
        setShowModal(true);
    };

    const updatePerm = (mod, field, val) => setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.map(p => p.module === mod ? { ...p, [field]: val ? 1 : 0 } : p)
    }));

    const getPerm = (mod, field) => formData.permissions.find(p => p.module === mod)?.[field] === 1;

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Roles</h2>
                    <p className="text-sm text-gray-500">Manage user roles and their permissions</p>
                </div>
                <Button onClick={() => openModal()} icon={Plus}>Add Role</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                    <div key={role.id} className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md">
                                <Shield size={20} />
                            </div>
                            {!role.is_system && (
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(role)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(role.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                                </div>
                            )}
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">{role.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{role.description || 'No description'}</p>
                        <div className="flex items-center gap-2">
                            {role.is_system ? (
                                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">System</span>
                            ) : (
                                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                                    {role.permissions?.filter(p => p.can_view).length || 0} modules
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <Modal title={formData.id ? 'Edit Role' : 'New Role'} onClose={() => setShowModal(false)} size="lg">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Role Name" required value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                            <FormInput label="Description" value={formData.description} onChange={v => setFormData({ ...formData, description: v })} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Module Permissions</label>
                            <div className="rounded-xl border border-gray-200 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Module</th>
                                            <th className="text-center px-4 py-3 font-medium text-gray-600">View</th>
                                            <th className="text-center px-4 py-3 font-medium text-gray-600">Create</th>
                                            <th className="text-center px-4 py-3 font-medium text-gray-600">Edit</th>
                                            <th className="text-center px-4 py-3 font-medium text-gray-600">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {MODULES.map((mod) => (
                                            <tr key={mod.key} className="hover:bg-emerald-50/30">
                                                <td className="px-4 py-3 font-medium text-gray-700">{mod.label}</td>
                                                {['can_view', 'can_create', 'can_edit', 'can_delete'].map(f => (
                                                    <td key={f} className="px-4 py-3 text-center">
                                                        <input type="checkbox" checked={getPerm(mod.key, f)} onChange={e => updatePerm(mod.key, f, e.target.checked)}
                                                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <ModalFooter onCancel={() => setShowModal(false)} saving={saving} label="Save Role" />
                    </form>
                </Modal>
            )}
        </>
    );
};

// ============ AUDIT LOG ============
const AuditLog = ({ currentUser }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadLogs(); }, [currentUser]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            if (window.electronAPI) {
                const data = await window.electronAPI.getAuditLogs({ companyId: currentUser?.company_id, limit: 100 });
                setLogs(data || []);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-gray-50 rounded-xl overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4">Details</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {logs.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-12"><EmptyState message="No activity yet" /></td></tr>
                    ) : logs.map((log) => (
                        <tr key={log.id} className="hover:bg-emerald-50/30 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                            <td className="px-6 py-4 font-medium text-gray-800">{log.fullname || log.username}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">{log.action}</span></td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{log.details || '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ============ SHARED COMPONENTS ============
const Button = ({ children, onClick, icon: Icon, type = 'button', disabled, className = '' }) => (
    <button type={type} onClick={onClick} disabled={disabled}
        className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-200 disabled:opacity-50 transition-all ${className}`}>
        {Icon && <Icon size={18} />}
        {children}
    </button>
);

const StatusBadge = ({ active }) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
        {active ? 'Active' : 'Inactive'}
    </span>
);

const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
);

const EmptyState = ({ message }) => (
    <div className="text-center py-8">
        <p className="text-gray-400">{message}</p>
    </div>
);

const FormInput = ({ label, type = 'text', value, onChange, required, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <input type={type} required={required} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 focus:bg-white transition-all" />
    </div>
);

const FormTextarea = ({ label, value, onChange, rows = 2, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 focus:bg-white transition-all resize-none" />
    </div>
);

const FormSelect = ({ label, value, onChange, options, required, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <select required={required} value={value || ''} onChange={e => onChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 focus:bg-white transition-all appearance-none">
            <option value="">{placeholder || 'Select...'}</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

const Modal = ({ title, children, onClose, size = 'md' }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div onClick={e => e.stopPropagation()} className={`bg-white rounded-2xl shadow-2xl w-full ${size === 'lg' ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200`}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                    <X size={20} />
                </button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

const ModalFooter = ({ onCancel, saving, label = 'Save' }) => (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl font-medium transition-colors">
            Cancel
        </button>
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-200 disabled:opacity-50 transition-all">
            {saving ? 'Saving...' : label}
        </button>
    </div>
);

export default Company;
