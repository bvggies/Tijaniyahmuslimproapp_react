// Quick script to update admin user role
// Run with: node update-admin-role.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAdminRole() {
  try {
    console.log('🔍 Looking for admin user...');
    
    const user = await prisma.user.findUnique({
      where: { email: 'admin@tijaniyahpro.com' },
    });

    if (!user) {
      console.error('❌ Admin user not found!');
      console.log('Creating admin user...');
      
      const bcrypt = require('bcrypt');
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      const newUser = await prisma.user.create({
        data: {
          email: 'admin@tijaniyahpro.com',
          passwordHash,
          name: 'Super Administrator',
          role: 'ADMIN',
        },
      });
      
      console.log('✅ Admin user created with ADMIN role:', newUser.email);
      return;
    }

    console.log('👤 Found user:', user.email);
    console.log('📋 Current role:', user.role || 'NOT SET');

    // Check if role field exists
    if (user.role === undefined) {
      console.log('⚠️  Role field does not exist in database!');
      console.log('📝 You need to run the migration first:');
      console.log('   npx prisma migrate dev --name add_user_roles');
      return;
    }

    if (user.role === 'ADMIN') {
      console.log('✅ User already has ADMIN role!');
      return;
    }

    console.log('🔄 Updating role to ADMIN...');
    
    const updated = await prisma.user.update({
      where: { email: 'admin@tijaniyahpro.com' },
      data: { role: 'ADMIN' },
    });

    console.log('✅ Successfully updated user role to ADMIN!');
    console.log('📧 Email:', updated.email);
    console.log('👤 Role:', updated.role);
    console.log('');
    console.log('🎉 You can now login to the admin dashboard!');
    
  } catch (error) {
    if (error.code === 'P2025') {
      console.error('❌ User not found');
    } else if (error.message.includes('Unknown arg `role`')) {
      console.error('❌ Role field does not exist in database!');
      console.log('');
      console.log('📝 You need to run the migration first:');
      console.log('   1. cd api');
      console.log('   2. npx prisma migrate dev --name add_user_roles');
      console.log('   3. Then run this script again');
    } else {
      console.error('❌ Error:', error.message);
      console.error(error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminRole();

