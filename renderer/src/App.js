import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Purchase from './components/Purchase';
import Sales from './components/Sales';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import Expenses from './components/Expenses';
import Reports from './components/Reports';
import Users from './components/Users';
import Settings from './components/Settings';
import Company from './components/Company';
import Accounting from './components/Accounting';
import HRM from './components/HRM';
import Backup from './components/Backup';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const handleLoginSuccess = (userData, permissions = []) => {
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('permissions', JSON.stringify(permissions));
    };

    const handleLogout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('permissions');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <Router>
            <Layout user={user} onLogout={handleLogout}>
                <Routes>
                    <Route path="/" element={<Dashboard currentUser={user} />} />
                    <Route path="/inventory" element={<Inventory currentUser={user} />} />
                    <Route path="/purchase" element={<Purchase currentUser={user} />} />
                    <Route path="/sales" element={<Sales currentUser={user} />} />
                    <Route path="/customers" element={<Customers currentUser={user} />} />
                    <Route path="/suppliers" element={<Suppliers currentUser={user} />} />
                    <Route path="/expenses" element={<Expenses currentUser={user} />} />
                    <Route path="/reports" element={<Reports currentUser={user} />} />
                    <Route path="/accounting" element={<Accounting />} />
                    <Route path="/hrm" element={<HRM />} />
                    <Route path="/backup" element={<Backup />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/company" element={<Company />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
