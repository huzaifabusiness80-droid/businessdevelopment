const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 2000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // TODO: Move to .env

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Helper: Error Handler
const handleError = (res, e, msg = "Server Error") => {
    console.error(msg, e);
    res.status(500).json({ success: false, message: e.message });
};

// ==========================================
// AUTHENTICATION
// ==========================================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                company: true,
                role: {
                    include: { permissions: true }
                }
            }
        });

        if (!user || !user.isActive) {
            return res.status(401).json({ success: false, message: 'Invalid credentials or inactive account' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role?.name, companyId: user.companyId },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Format Permissions
        const permissions = user.role?.permissions.map(p => ({
            module: p.module,
            can_view: p.canView ? 1 : 0,
            can_create: p.canCreate ? 1 : 0,
            can_edit: p.canEdit ? 1 : 0,
            can_delete: p.canDelete ? 1 : 0
        })) || [];

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                fullname: user.fullName,
                company_id: user.companyId,
                company_name: user.company?.name,
                role: user.role?.name,
                role_id: user.roleId
            },
            permissions
        });

    } catch (e) { handleError(res, e, "Login Error"); }
});

// ==========================================
// COMPANIES
// ==========================================
app.get('/api/companies', async (req, res) => {
    try {
        const companies = await prisma.company.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(companies);
    } catch (e) { handleError(res, e); }
});

app.get('/api/companies/:id', async (req, res) => {
    try {
        const company = await prisma.company.findUnique({ where: { id: req.params.id } });
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (e) { handleError(res, e); }
});

app.post('/api/companies', async (req, res) => {
    try {
        // Handle field mapping if needed (frontend uses underscore, schema uses camelCase mostly, but Prisma maps it if @map is used)
        // Schema has @map("tax_number") so taxNumber or tax_number logic depends on Prisma client input.
        // Prisma Client 'create' expects model field names (camelCase).

        const { name, address, phone, email, tax_no, currency_symbol } = req.body;

        const company = await prisma.company.create({
            data: {
                name,
                address,
                phone,
                email,
                taxNumber: tax_no,
                currency: currency_symbol || 'PKR'
            }
        });
        res.json({ success: true, id: company.id, ...company });
    } catch (e) { handleError(res, e); }
});

app.put('/api/companies/:id', async (req, res) => {
    try {
        const { name, address, phone, email, tax_no, currency_symbol } = req.body;
        const company = await prisma.company.update({
            where: { id: req.params.id },
            data: {
                name,
                address,
                phone,
                email,
                taxNumber: tax_no,
                currency: currency_symbol
            }
        });
        res.json({ success: true, changes: 1 });
    } catch (e) { handleError(res, e); }
});

// ==========================================
// USERS
// ==========================================

app.get('/', (req, res) => {
    res.send("Hello World")
})
app.get('/api/users', async (req, res) => {
    try {
        const { companyId, includeInactive } = req.query;
        const where = {
            isActive: includeInactive === 'true' ? undefined : true
        };
        if (companyId) where.companyId = companyId;

        const users = await prisma.user.findMany({
            where,
            include: { company: true, role: true },
            orderBy: { createdAt: 'desc' }
        });

        // Transform to match local format expected by frontend if needed
        const mappedUsers = users.map(u => ({
            id: u.id,
            username: u.username,
            fullname: u.fullName,
            role: u.role?.name,
            role_id: u.roleId,
            company_id: u.companyId,
            company_name: u.company?.name,
            is_active: u.isActive ? 1 : 0,
            created_at: u.createdAt
        }));

        res.json(mappedUsers);
    } catch (e) { handleError(res, e); }
});

app.post('/api/users', async (req, res) => {
    try {
        const { company_id, username, password, role, fullname } = req.body;

        // More robust role matching (case-insensitive and map local names)
        const roleMap = {
            'super_admin': 'Super Admin',
            'admin': 'Admin',
            'manager': 'Manager',
            'staff': 'Staff'
        };
        const searchRole = roleMap[role.toLowerCase()] || role;

        let roleRec = await prisma.role.findFirst({
            where: {
                AND: [
                    {
                        OR: [
                            { name: { equals: searchRole, mode: 'insensitive' } },
                            { name: { equals: role, mode: 'insensitive' } }
                        ]
                    },
                    {
                        OR: [
                            { companyId: company_id },
                            { isSystem: true }
                        ]
                    }
                ]
            }
        });

        if (!roleRec) {
            // Fallback: search just by name if company match fails
            roleRec = await prisma.role.findFirst({
                where: { name: { equals: searchRole, mode: 'insensitive' } }
            });
        }

        if (!roleRec) {
            return res.status(400).json({ success: false, message: `Role '${role}' not found in system` });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                companyId: company_id,
                username,
                password: passwordHash,
                roleId: roleRec.id,
                fullName: fullname,
                isActive: true
            }
        });
        res.json({ success: true, id: user.id });
    } catch (e) {
        if (e.code === 'P2002') return res.json({ success: false, message: 'Username already exists' });
        handleError(res, e);
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { company_id, username, password, role, fullname, is_active } = req.body;

        let updateData = {
            companyId: company_id,
            username,
            fullName: fullname,
            isActive: is_active === 1 || is_active === true
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (role) {
            const roleMap = {
                'super_admin': 'Super Admin',
                'admin': 'Admin',
                'manager': 'Manager',
                'staff': 'Staff'
            };
            const searchRole = roleMap[role.toLowerCase()] || role;

            const roleRec = await prisma.role.findFirst({
                where: {
                    AND: [
                        {
                            OR: [
                                { name: { equals: searchRole, mode: 'insensitive' } },
                                { name: { equals: role, mode: 'insensitive' } }
                            ]
                        },
                        {
                            OR: [
                                { companyId: company_id },
                                { isSystem: true }
                            ]
                        }
                    ]
                }
            });
            if (roleRec) updateData.roleId = roleRec.id;
        }

        await prisma.user.update({
            where: { id: req.params.id },
            data: updateData
        });
        res.json({ success: true, changes: 1 });
    } catch (e) { handleError(res, e); }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        // Try hard delete first
        await prisma.user.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true, changes: 1, message: "User deleted permanently" });
    } catch (e) {
        // If has records (Sale, etc), fall back to soft delete
        if (e.code === 'P2003') {
            await prisma.user.update({
                where: { id: req.params.id },
                data: { isActive: false }
            });
            return res.json({ success: true, changes: 1, message: "User deactivated (contained related records)" });
        }
        handleError(res, e);
    }
});

// ==========================================
// ROLES
// ==========================================
// ==========================================
// ROLES & PERMISSIONS
// ==========================================
app.get('/api/roles', async (req, res) => {
    try {
        const { companyId } = req.query;
        const roles = await prisma.role.findMany({
            where: {
                OR: [
                    { companyId: companyId },
                    { isSystem: true }
                ]
            },
            include: { permissions: true },
            orderBy: [{ isSystem: 'desc' }, { name: 'asc' }]
        });
        res.json(roles);
    } catch (e) { handleError(res, e); }
});

app.post('/api/roles', async (req, res) => {
    try {
        const { company_id, name, description, permissions } = req.body;

        const role = await prisma.role.create({
            data: {
                companyId: company_id,
                name,
                description,
                isSystem: false,
                permissions: {
                    create: permissions.map(p => ({
                        module: p.module,
                        canView: p.can_view === 1 || p.can_view === true,
                        canCreate: p.can_create === 1 || p.can_create === true,
                        canEdit: p.can_edit === 1 || p.can_edit === true,
                        canDelete: p.can_delete === 1 || p.can_delete === true
                    }))
                }
            },
            include: { permissions: true }
        });

        res.json({ success: true, id: role.id, ...role });
    } catch (e) { handleError(res, e); }
});

app.put('/api/roles/:id', async (req, res) => {
    try {
        const { name, description, permissions } = req.body;

        // Use a transaction to ensure atomic update of role and its permissions
        const role = await prisma.$transaction(async (tx) => {
            // 1. Update Role basic info
            const updatedRole = await tx.role.update({
                where: { id: req.params.id },
                data: { name, description }
            });

            // 2. Clear old permissions and insert new ones
            if (permissions) {
                await tx.permission.deleteMany({ where: { roleId: req.params.id } });
                await tx.permission.createMany({
                    data: permissions.map(p => ({
                        roleId: req.params.id,
                        module: p.module,
                        canView: p.can_view === 1 || p.can_view === true,
                        canCreate: p.can_create === 1 || p.can_create === true,
                        canEdit: p.can_edit === 1 || p.can_edit === true,
                        canDelete: p.can_delete === 1 || p.can_delete === true
                    }))
                });
            }

            return updatedRole;
        });

        res.json({ success: true, changes: 1 });
    } catch (e) { handleError(res, e); }
});

app.delete('/api/roles/:id', async (req, res) => {
    try {
        // First check if it's a system role
        const role = await prisma.role.findUnique({ where: { id: req.params.id } });
        if (!role || role.isSystem) {
            return res.status(403).json({ success: false, message: "Cannot delete system roles" });
        }

        await prisma.role.delete({ where: { id: req.params.id } });
        res.json({ success: true, changes: 1 });
    } catch (e) { handleError(res, e); }
});

app.get('/api/permissions', async (req, res) => {
    try {
        const { roleId } = req.query;
        if (!roleId) return res.status(400).json({ message: "roleId is required" });

        const permissions = await prisma.permission.findMany({
            where: { roleId }
        });

        // Map to local format if needed
        const mapped = permissions.map(p => ({
            id: p.id,
            role_id: p.roleId,
            module: p.module,
            can_view: p.canView ? 1 : 0,
            can_create: p.canCreate ? 1 : 0,
            can_edit: p.canEdit ? 1 : 0,
            can_delete: p.canDelete ? 1 : 0
        }));

        res.json(mapped);
    } catch (e) { handleError(res, e); }
});

// ==========================================
// INVENTORY (Categories, Brands & Products)
// ==========================================

// --- CATEGORIES ---
app.get('/api/categories', async (req, res) => {
    try {
        const { companyId } = req.query;
        const categories = await prisma.category.findMany({
            where: { companyId },
            orderBy: { name: 'asc' }
        });
        res.json(categories);
    } catch (e) { handleError(res, e); }
});

app.post('/api/categories', async (req, res) => {
    try {
        const { companyId, name } = req.body;
        const category = await prisma.category.create({
            data: { companyId, name }
        });
        res.json({ success: true, id: category.id });
    } catch (e) { handleError(res, e); }
});

app.put('/api/categories/:id', async (req, res) => {
    try {
        const { name } = req.body;
        await prisma.category.update({
            where: { id: req.params.id },
            data: { name }
        });
        res.json({ success: true, changes: 1 });
    } catch (e) { handleError(res, e); }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        await prisma.category.delete({ where: { id: req.params.id } });
        res.json({ success: true, changes: 1 });
    } catch (e) {
        if (e.code === 'P2003') return res.status(400).json({ success: false, message: "Category is in use and cannot be deleted" });
        handleError(res, e);
    }
});

// --- BRANDS ---
app.get('/api/brands', async (req, res) => {
    try {
        const { companyId } = req.query;
        const brands = await prisma.brand.findMany({
            where: { companyId },
            orderBy: { name: 'asc' }
        });
        res.json(brands);
    } catch (e) { handleError(res, e); }
});

app.post('/api/brands', async (req, res) => {
    try {
        const { companyId, name } = req.body;
        const brand = await prisma.brand.create({
            data: { companyId, name }
        });
        res.json({ success: true, id: brand.id });
    } catch (e) { handleError(res, e); }
});

app.put('/api/brands/:id', async (req, res) => {
    try {
        const { name } = req.body;
        await prisma.brand.update({
            where: { id: req.params.id },
            data: { name }
        });
        res.json({ success: true, changes: 1 });
    } catch (e) { handleError(res, e); }
});

app.delete('/api/brands/:id', async (req, res) => {
    try {
        await prisma.brand.delete({ where: { id: req.params.id } });
        res.json({ success: true, changes: 1 });
    } catch (e) {
        if (e.code === 'P2003') return res.status(400).json({ success: false, message: "Brand is in use and cannot be deleted" });
        handleError(res, e);
    }
});

// --- PRODUCTS ---
app.get('/api/products', async (req, res) => {
    try {
        const { companyId } = req.query;
        const products = await prisma.product.findMany({
            where: { companyId },
            include: { category: true, brand: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (e) { handleError(res, e); }
});

app.post('/api/products', async (req, res) => {
    try {
        const { companyId, name, sku, cost_price, sell_price, stock_qty, alert_qty, category_id, brand_id, image_url, description } = req.body;
        const product = await prisma.product.create({
            data: {
                companyId,
                name,
                sku,
                description,
                costPrice: parseFloat(cost_price) || 0,
                sellPrice: parseFloat(sell_price) || 0,
                stockQty: parseInt(stock_qty) || 0,
                alertQty: parseInt(alert_qty) || 5,
                categoryId: category_id,
                brandId: brand_id,
                imageUrl: image_url
            }
        });
        res.json({ success: true, id: product.id });
    } catch (e) { handleError(res, e); }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { name, sku, cost_price, sell_price, stock_qty, alert_qty, category_id, brand_id, image_url, description } = req.body;
        await prisma.product.update({
            where: { id: req.params.id },
            data: {
                name,
                sku,
                description,
                costPrice: cost_price !== undefined ? parseFloat(cost_price) : undefined,
                sellPrice: sell_price !== undefined ? parseFloat(sell_price) : undefined,
                stockQty: stock_qty !== undefined ? parseInt(stock_qty) : undefined,
                alertQty: alert_qty !== undefined ? parseInt(alert_qty) : undefined,
                categoryId: category_id,
                brandId: brand_id,
                imageUrl: image_url
            }
        });
        res.json({ success: true, changes: 1 });
    } catch (e) { handleError(res, e); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: req.params.id } });
        res.json({ success: true, changes: 1 });
    } catch (e) {
        if (e.code === 'P2003') return res.status(400).json({ success: false, message: "Product has transaction history and cannot be deleted" });
        handleError(res, e);
    }
});

// ==========================================
// SALES
// ==========================================
app.get('/api/sales', async (req, res) => {
    try {
        const { companyId } = req.query;
        const sales = await prisma.sale.findMany({
            where: { companyId },
            include: { customer: true, user: true, items: { include: { product: true } } },
            orderBy: { date: 'desc' }
        });
        res.json(sales);
    } catch (e) { handleError(res, e); }
});

app.post('/api/sales', async (req, res) => {
    try {
        const { companyId, customerId, userId, invoiceNo, subTotal, discount, tax, grandTotal, items } = req.body;

        await prisma.$transaction(async (tx) => {
            // 1. Create Sale Record
            const sale = await tx.sale.create({
                data: {
                    companyId,
                    customerId,
                    userId,
                    invoiceNo,
                    subTotal: parseFloat(subTotal),
                    discount: parseFloat(discount) || 0,
                    tax: parseFloat(tax) || 0,
                    grandTotal: parseFloat(grandTotal),
                    items: {
                        create: items.map(item => ({
                            productId: item.productId,
                            quantity: parseInt(item.quantity),
                            price: parseFloat(item.price),
                            total: parseFloat(item.total)
                        }))
                    }
                }
            });

            // 2. Deduct Stock for each item
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQty: { decrement: parseInt(item.quantity) }
                    }
                });
            }

            return sale;
        });

        res.json({ success: true, message: "Sale recorded and stock updated" });
    } catch (e) { handleError(res, e); }
});

// ==========================================
// AUDIT LOGS
// ==========================================
app.get('/api/audit-logs', async (req, res) => {
    try {
        const { companyId, limit = 50 } = req.query;
        // Check if we have an AuditLog model (it's not in schema.prisma yet, let's assume it or add a placeholder)
        // Since it's missing, let's return empty for now or add to schema.
        res.json([]);
    } catch (e) { handleError(res, e); }
});

// 404 Catch-all
app.use((req, res) => {
    console.warn(`[404 Not Found] ${req.method} ${req.url}`);
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// Start Server
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Cloud Server is running on port ${PORT}`);
    });
}

module.exports = app;
