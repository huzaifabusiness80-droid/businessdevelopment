const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { username: 'superadmin' },
        include: { role: true }
    });

    if (user) {
        console.log('Verification Success: User found');
        console.log('Username:', user.username);
        console.log('Role:', user.role ? user.role.name : 'No Role');
        console.log('Company ID:', user.companyId);
    } else {
        console.error('Verification Failed: User superadmin not found');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
