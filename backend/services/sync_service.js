const db = require('../database/db_manager');
const axios = require('axios');

const CLOUD_URL = 'http://localhost:5000/api'; // TODO: Make configurable

class SyncService {
    constructor() {
        this.isSyncing = false;
    }

    async syncData() {
        if (this.isSyncing) {
            console.log('Sync already in progress...');
            return;
        }

        this.isSyncing = true;
        console.log('Starting sync process...');

        try {
            await this.syncCompanies();
            await this.syncUsers();
            // TODO: Add other entities (Products, Sales, etc.)
            console.log('Sync process completed successfully.');
        } catch (error) {
            console.error('Sync failed:', error.message);
        } finally {
            this.isSyncing = false;
        }
    }

    // Generic helper to get pending records
    getPendingRecords(table) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${table} WHERE sync_status = 'pending'`, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Generic helper to update record after sync
    markSynced(table, localId, globalId) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE ${table} SET sync_status = 'synced', global_id = ? WHERE id = ?`,
                [globalId, localId],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    async syncCompanies() {
        const companies = await this.getPendingRecords('companies');
        for (const company of companies) {
            try {
                // Prepare payload (map local fields to cloud expected fields if necessary)
                // Cloud expects camelCase for some fields? Prisma usually handles standard names, 
                // but let's check Cloud Schema: name, address, phone, email, etc.
                const payload = {
                    name: company.name,
                    address: company.address,
                    phone: company.phone,
                    email: company.email,
                    taxNumber: company.tax_no, // Local: tax_no -> Cloud: taxNumber? Check Schema
                    logoUrl: company.logo_path,
                    currency: company.currency_symbol,
                    // Cloud generates ID, we store it
                };

                const response = await axios.post(`${CLOUD_URL}/companies`, payload);
                if (response.data && response.data.id) {
                    await this.markSynced('companies', company.id, response.data.id);
                    console.log(`Synced company: ${company.name}`);
                }
            } catch (error) {
                console.error(`Failed to sync company ${company.name}:`, error.message);
            }
        }
    }

    async syncUsers() {
        const users = await this.getPendingRecords('users');
        for (const user of users) {
            try {
                // Users need a companyId (global_id of their company)
                // We must ensure the company is synced first
                if (!user.company_id) continue; // Skip super admin for now if they don't have company

                // Get global_id of the company
                const company = await new Promise((resolve) => {
                    db.get('SELECT global_id FROM companies WHERE id = ?', [user.company_id], (err, row) => resolve(row));
                });

                if (!company || !company.global_id) {
                    console.warn(`Cannot sync user ${user.username}: Company not synced yet.`);
                    continue;
                }

                const payload = {
                    username: user.username,
                    password: user.password, // Be careful sending raw passwords. Secure this later.
                    roleId: null, // We need to handle roles mapping. For now let's focus on user creation.
                    // Or Cloud might create default role?
                    companyId: company.global_id,
                    fullName: user.fullname,
                    email: user.email, // If exists in local
                };

                // We might need a special endpoint for syncing users that accepts raw password or hash
                // For now assuming /api/users works
                const response = await axios.post(`${CLOUD_URL}/users`, payload);

                if (response.data && response.data.id) {
                    await this.markSynced('users', user.id, response.data.id);
                    console.log(`Synced user: ${user.username}`);
                }
            } catch (error) {
                console.error(`Failed to sync user ${user.username}:`, error.message);
            }
        }
    }
}

module.exports = new SyncService();
