import React, { useState, useEffect } from 'react';
import { Building2, Users, Shield, ClipboardList, Plus, Search, Edit2, Trash2, X, Eye, EyeOff, Check, ChevronDown, Info } from 'lucide-react';

const tabs = [
    { id: 'profile', label: 'Company', icon: Building2, color: 'orange' },
    { id: 'users', label: 'Team', icon: Users, color: 'purple' },
    { id: 'roles', label: 'Access', icon: Shield, color: 'emerald' },
    { id: 'audit', label: 'History', icon: ClipboardList, color: 'blue' },
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Organization Settings</h1>
                    <p className="text-gray-500 mt-1">Manage company identity, team members and access controls.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden min-h-[600px] flex flex-col">
                {/* Modern Tab Bar */}
                <div className="flex items-center px-8 bg-gray-50/50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => {
                        const label = (tab.id === 'profile' && isSuperAdmin) ? 'Companies' : tab.label;
                        return (
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
                                <span>{label}</span>
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-t-full"></div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-8 flex-1">
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
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyUsers, setCompanyUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
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

    const openDetailModal = async (company) => {
        setSelectedCompany(company);
        setShowDetailModal(true);
        setLoadingUsers(true);
        try {
            if (window.electronAPI) {
                const users = await window.electronAPI.getUsers(company.id);
                setCompanyUsers(users || []);
            }
        } catch (err) {
            window.alert('Error loading users: ' + err.message);
        }
        setLoadingUsers(false);
    };

    if (loading) return <LoadingSpinner />;

    if (isSuperAdmin) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Registered Companies</h2>
                        <p className="text-sm text-gray-500">Managing {companies.length} business entities</p>
                    </div>
                    <Button onClick={() => openModal()} icon={Plus}>Register Company</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((c) => (
                        <div key={c.id} className="group relative bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50/50 hover:shadow-orange-100/50 transition-all duration-500 hover:-translate-y-1">
                            <div className="flex items-start justify-between mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                                        {c.name?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openDetailModal(c)} className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all">
                                        <Info size={18} />
                                    </button>
                                    <button onClick={() => openModal(c)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                        <Edit2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors truncate">{c.name}</h3>
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center text-sm font-medium text-gray-500 gap-2">
                                        <Building2 size={14} className="text-gray-300" />
                                        <span className="truncate">{c.email || 'No email'}</span>
                                    </div>
                                    <div className="flex items-center text-sm font-medium text-gray-500 gap-2">
                                        <Users size={14} className="text-gray-300" />
                                        <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[10px] uppercase font-black tracking-wider">Active Tenants</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {companies.length === 0 && (
                        <div className="col-span-full">
                            <EmptyState message="No companies found" icon={Building2} />
                        </div>
                    )}
                </div>

                {showModal && (
                    <Modal title={formData.id ? 'Edit Company Profile' : 'Register New Business'} onClose={() => setShowModal(false)} size="lg">
                        <form onSubmit={handleSave} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                                        Basic Information
                                    </h4>
                                    <FormInput label="Company Name" required value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="e.g. Acme Corporation" icon={Building2} />
                                    <FormInput label="Currency Symbol" value={formData.currency_symbol} onChange={v => setFormData({ ...formData, currency_symbol: v })} placeholder="PKR" />
                                </div>
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                                        Contact & Compliance
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 md:col-span-1">
                                            <FormInput label="Email" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} placeholder="office@company.com" />
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <FormInput label="Phone" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} placeholder="+92 300 1234567" />
                                        </div>
                                    </div>
                                    <FormInput label="Tax/NTN Number" value={formData.tax_no} onChange={v => setFormData({ ...formData, tax_no: v })} placeholder="Optional" />
                                </div>
                                <div className="col-span-full">
                                    <FormTextarea label="Registered Address" value={formData.address} onChange={v => setFormData({ ...formData, address: v })} placeholder="Complete physical address..." />
                                </div>
                            </div>
                            <ModalFooter onCancel={() => setShowModal(false)} saving={saving} label={formData.id ? 'Save Profile' : 'Create Organization'} />
                        </form>
                    </Modal>
                )}

                {showDetailModal && selectedCompany && (
                    <Modal title="Company Details" onClose={() => setShowDetailModal(false)} size="lg">
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200">
                                <div className="flex items-start gap-5">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl blur-lg opacity-50"></div>
                                        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                                            {selectedCompany.name?.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCompany.name}</h2>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="text-gray-500 font-medium">Email:</span>
                                                <p className="text-gray-800 font-semibold">{selectedCompany.email || '—'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 font-medium">Phone:</span>
                                                <p className="text-gray-800 font-semibold">{selectedCompany.phone || '—'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Users size={20} className="text-orange-600" />
                                        Company Users
                                    </h3>
                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                                        {companyUsers.length} Users
                                    </span>
                                </div>

                                {loadingUsers ? <LoadingSpinner /> : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                        {companyUsers.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-200 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                                                        {user.fullname?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{user.fullname}</p>
                                                        <p className="text-xs text-gray-500">@{user.username}</p>
                                                    </div>
                                                </div>
                                                <StatusBadge active={user.is_active} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div className="p-8 bg-gradient-to-br from-orange-50 to-white rounded-[2rem] border border-orange-100 shadow-xl shadow-orange-50/20">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-orange-500 rounded-[2rem] blur-xl opacity-20"></div>
                        <div className="relative w-32 h-32 rounded-[2rem] bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-5xl shadow-2xl">
                            {formData.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Company Name" required value={formData.name} onChange={v => setFormData({ ...formData, name: v })} icon={Building2} />
                            <FormInput label="Tax/NTN Number" value={formData.tax_no} onChange={v => setFormData({ ...formData, tax_no: v })} icon={Shield} />
                            <FormInput label="Currency" value={formData.currency_symbol} onChange={v => setFormData({ ...formData, currency_symbol: v })} />
                            <FormInput label="Email Address" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} icon={Building2} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-orange-100 flex justify-end">
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Updating...' : 'Update Organization Profile'}
                    </Button>
                </div>
            </div>
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

    const stats = {
        total: users.length,
        active: users.filter(u => u.is_active).length,
        admins: users.filter(u => u.role?.toLowerCase().includes('admin')).length,
        staff: users.filter(u => !u.role?.toLowerCase().includes('admin')).length
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Team Members" value={stats.total} icon={Users} color="orange" />
                <StatCard title="Active Now" value={stats.active} icon={Check} color="emerald" />
                <StatCard title="Administrators" value={stats.admins} icon={Shield} color="purple" />
                <StatCard title="Support Staff" value={stats.staff} icon={Users} color="blue" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or username..."
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm"
                    />
                </div>
                <Button onClick={() => openModal()} icon={Plus}>Onboard New Member</Button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">User Identity</th>
                                {isSuperAdmin && <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Company</th>}
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Role & Access</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((user) => (
                                <tr key={user.id} className="hover:bg-orange-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-orange-400 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                                    {user.fullname?.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{user.fullname}</p>
                                                <p className="text-xs text-gray-400 font-medium">@{user.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-gray-600">{user.company_name || 'System Account'}</span>
                                        </td>
                                    )}
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">
                                            {user.role?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <StatusBadge active={user.is_active} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={() => openModal(user)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(user.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <Modal title={formData.id ? 'Modify User Controls' : 'Onboard New Staff'} onClose={() => setShowModal(false)} size="md">
                    <form onSubmit={handleSave} className="space-y-6">
                        {isSuperAdmin && (
                            <FormSelect label="Assign to Company" required value={formData.company_id} onChange={v => setFormData({ ...formData, company_id: v })} options={companies.map(c => ({ value: c.id, label: c.name }))} placeholder="Select organization" icon={Building2} />
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Full Name" required value={formData.fullname} onChange={v => setFormData({ ...formData, fullname: v })} placeholder="John Doe" icon={Users} />
                            <FormInput label="User ID / Username" required value={formData.username} onChange={v => setFormData({ ...formData, username: v })} placeholder="j_doe" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <FormInput
                                    label={formData.id ? "New Password (Leave blank to keep)" : "Access Password"}
                                    type={showPassword ? 'text' : 'password'}
                                    required={!formData.id}
                                    value={formData.password}
                                    onChange={v => setFormData({ ...formData, password: v })}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-10 text-gray-400 hover:text-orange-500 transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <FormSelect label="Access Level" required value={formData.role} onChange={v => setFormData({ ...formData, role: v })} options={roles.map(r => ({ value: r.name.toLowerCase().replace(' ', '_'), label: r.name }))} icon={Shield} />
                        </div>
                        <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl cursor-pointer group hover:bg-orange-50 transition-colors">
                            <input type="checkbox" checked={formData.is_active === 1} onChange={e => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })} className="w-5 h-5 rounded-lg border-gray-300 text-orange-600 focus:ring-orange-500" />
                            <div>
                                <p className="text-sm font-bold text-gray-900">Active Account</p>
                                <p className="text-xs text-gray-500">Enable user to log in to the system</p>
                            </div>
                        </label>
                        <ModalFooter onCancel={() => setShowModal(false)} saving={saving} />
                    </form>
                </Modal>
            )}
        </div>
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
        if (!window.confirm('Delete this role definition?')) return;
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
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Access Roles</h2>
                    <p className="text-sm text-gray-500">Define custom permission sets for your team members</p>
                </div>
                <Button onClick={() => openModal()} icon={Plus}>Create New Role</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <div key={role.id} className="group relative bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50/50 hover:shadow-orange-100/50 transition-all duration-500 hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform duration-300">
                                <Shield size={24} />
                            </div>
                            {!role.is_system && (
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(role)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(role.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-600 transition-colors">{role.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[2.5rem]">{role.description || 'No description provided'}</p>
                        <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${role.is_system ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                {role.is_system ? 'System Default' : 'Custom Role'}
                            </span>
                            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                <Check size={14} className="text-emerald-500" />
                                {role.permissions?.filter(p => p.can_view).length || 0} Modules
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <Modal title={formData.id ? 'Edit Access Level' : 'Define New Permission Set'} onClose={() => setShowModal(false)} size="lg">
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Role Name" required value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="e.g. Sales Manager" />
                            <FormInput label="Description (Purpose)" value={formData.description} onChange={v => setFormData({ ...formData, description: v })} placeholder="What can this role do?" />
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                                Granular Permissions Matrix
                            </h4>
                            <div className="rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50/80">
                                            <tr>
                                                <th className="text-left px-6 py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Module Name</th>
                                                <th className="text-center px-6 py-4 font-black text-xs text-gray-400 uppercase tracking-widest">View</th>
                                                <th className="text-center px-6 py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Create</th>
                                                <th className="text-center px-6 py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Edit</th>
                                                <th className="text-center px-6 py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {MODULES.map((mod) => (
                                                <tr key={mod.key} className="hover:bg-emerald-50/30 group transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-700">{mod.label}</td>
                                                    {['can_view', 'can_create', 'can_edit', 'can_delete'].map(f => (
                                                        <td key={f} className="px-6 py-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={getPerm(mod.key, f)}
                                                                onChange={e => updatePerm(mod.key, f, e.target.checked)}
                                                                className="w-5 h-5 rounded-lg border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <ModalFooter onCancel={() => setShowModal(false)} saving={saving} label="Save Role Config" />
                    </form>
                </Modal>
            )}
        </div>
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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Activity History</h2>
                    <p className="text-sm text-gray-500">Real-time audit trail of all actions performed in the system</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Executor</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Operation</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12">
                                        <EmptyState message="No activity logs found for this organization" icon={ClipboardList} />
                                    </td>
                                </tr>
                            ) : logs.map((log) => (
                                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <ClipboardList size={16} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">
                                                {new Date(log.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-gray-900">{log.fullname || log.username}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-gray-200">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm text-gray-500 font-medium max-w-sm truncate group-hover:whitespace-normal transition-all">
                                            {log.details || 'No additional data available'}
                                        </p>
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

// ============ SHARED COMPONENTS ============
const StatCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        orange: 'from-orange-500 to-orange-600 shadow-orange-200',
        emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200',
        red: 'from-red-500 to-red-600 shadow-red-200',
        blue: 'from-blue-500 to-blue-600 shadow-blue-200',
        purple: 'from-purple-500 to-purple-600 shadow-purple-200',
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
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

const Button = ({ children, onClick, icon: Icon, type = 'button', disabled, className = '' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all active:scale-95 shadow-md group disabled:opacity-50 ${className}`}
    >
        {Icon && (
            <div className="p-1 px-1.5 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                <Icon size={18} />
            </div>
        )}
        <span>{children}</span>
    </button>
);

const StatusBadge = ({ active }) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
        {active ? 'Active' : 'Inactive'}
    </span>
);

const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
);

const EmptyState = ({ message, icon: Icon = Info }) => (
    <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
        <Icon size={48} className="mx-auto text-gray-200 mb-4" />
        <p className="text-gray-400 font-bold">{message}</p>
    </div>
);

const FormInput = ({ label, type = 'text', value, onChange, required, placeholder, icon: Icon }) => (
    <div className="space-y-1.5 text-left">
        <label className="text-sm font-bold text-gray-700 ml-1">{label} {required && '*'}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
            <input
                type={type}
                required={required}
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full ${Icon ? 'pl-12' : 'px-5'} pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium`}
            />
        </div>
    </div>
);

const FormTextarea = ({ label, value, onChange, rows = 3, placeholder, icon: Icon }) => (
    <div className="space-y-1.5 text-left">
        <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-4 text-gray-400" size={18} />}
            <textarea
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder}
                className={`w-full ${Icon ? 'pl-12' : 'px-5'} pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium resize-none`}
            />
        </div>
    </div>
);

const FormSelect = ({ label, value, onChange, options, required, placeholder, icon: Icon }) => (
    <div className="space-y-1.5 text-left">
        <label className="text-sm font-bold text-gray-700 ml-1">{label} {required && '*'}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
            <select
                required={required}
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                className={`w-full ${Icon ? 'pl-12' : 'px-5'} pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium appearance-none`}
            >
                <option value="">{placeholder || 'Select...'}</option>
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        </div>
    </div>
);

const Modal = ({ title, children, onClose, size = 'md' }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className={`bg-white rounded-[2.5rem] shadow-2xl w-full ${size === 'lg' ? 'max-w-4xl' : 'max-w-xl'} overflow-hidden animate-in zoom-in-95 duration-200`}>
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 max-h-[85vh] overflow-y-auto scrollbar-hide">{children}</div>
        </div>
    </div>
);

const ModalFooter = ({ onCancel, saving, label = 'Save Changes' }) => (
    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
        <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3.5 text-gray-500 font-bold hover:text-gray-700 transition-all rounded-2xl border border-transparent hover:bg-gray-100"
        >
            Cancel
        </button>
        <Button type="submit" disabled={saving}>
            {saving ? 'Processing...' : label}
        </Button>
    </div>
);

export default Company;
