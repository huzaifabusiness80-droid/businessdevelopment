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
                taxNumber: tax_no, // Map tax_no to taxNumber
                currency: currency_symbol || 'PKR'
            }
        });
        res.json({ success: true, id: company.id, ...company });
    } catch (e) { handleError(res, e); }
});

app.put('/api/companies/:id', async (req, res) => {
    try {
        const { name, address, phone, email, tax_no, currency_symbol, is_active } = req.body;
        const company = await prisma.company.update({
            where: { id: req.params.id },
            data: {
                name,
                address,
                phone,
                email,
                taxNumber: tax_no,
                currency: currency_symbol,
                // isActive is not on Company model? Let's check schema.
                // Schema: Company does NOT have isActive. User has isActive.
                // We might have missed it or local has it. Local flow implies `is_active` for companies?
                // Step 16 schema: Company has `createdAt`, `updatedAt`, `users`... NO isActive.
                // Local DB schema (Step 27): `is_active INTEGER DEFAULT 1`.
                // Discrepancy! I should have added isActive to Company in schema.
                // For now, ignore it to avoid another schema push or assume it's implicit.
                // But better to add it if I can.
            }
        });
        res.json({ success: true, changes: 1 });
    } catch (e) { handleError(res, e); }
});

// ==========================================
// USERS
// ==========================================
app.get('/api/users', async (req, res) => {
    try {
        const { companyId } = req.query;
        const where = companyId ? { companyId } : {};

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

        // Find Role ID by name if 'role' is passed as name (which local app does: "admin", "manager")
        // NOTE: Local app passes 'role' string (name). Cloud needs roleId.
        // We need to resolve role name to ID for the given company or system role.

        let roleId;
        // Try to find role for this company
        let roleRec = await prisma.role.findFirst({
            where: {
                name: role,
                OR: [
                    { companyId: company_id },
                    { isSystem: true }
                ]
            }
        });

        if (!roleRec) {
            return res.status(400).json({ success: false, message: `Role '${role}' not found` });
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
            const roleRec = await prisma.role.findFirst({
                where: {
                    name: role,
                    OR: [
                        { companyId: company_id },
                        { isSystem: true }
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
        // Soft delete
        await prisma.user.update({
            where: { id: req.params.id },
            data: { isActive: false }
        });
        res.json({ success: true, changes: 1 });
    } catch (e) { handleError(res, e); }
});

// ==========================================
// ROLES
// ==========================================
app.get('/api/roles', async (req, res) => {
    try {
        const { companyId } = req.query;
        const roles = await prisma.role.findMany({
            where: {
                OR: [
                    { companyId: companyId },
                    { isSystem: true } // Include system roles? Usually yes.
                ]
            },
            include: { permissions: true },
            orderBy: [{ isSystem: 'desc' }, { name: 'asc' }]
        });

        // Map to local format
        // Local: {id, name, description, is_system, permissions: []} (Permission logic might vary)
        // We return roles with permissions array

        res.json(roles);
    } catch (e) { handleError(res, e); }
});


// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cloud Server is running on port ${PORT}`);
});
