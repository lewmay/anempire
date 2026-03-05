import { createAdminUser } from '../lib/auth/service';

async function bootstrapAdmin() {
  const adminEmail = 'lewmay1@gmail.com';
  const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!bootstrapPassword) {
    console.error('❌ ERROR: ADMIN_BOOTSTRAP_PASSWORD environment variable not set');
    console.error('   Set it in your .env.local file or pass it when running the script:');
    console.error('   ADMIN_BOOTSTRAP_PASSWORD=your_temp_password bun run scripts/bootstrap-admin.ts');
    process.exit(1);
  }

  if (bootstrapPassword.length < 8) {
    console.error('❌ ERROR: Password must be at least 8 characters long');
    process.exit(1);
  }

  console.log('🔧 Checking for existing admin user...');

  try {
    const result = await createAdminUser(
      adminEmail,
      bootstrapPassword,
      'Admin User',
      'admin'
    );

    if (result.success) {
      console.log('✅ SUCCESS: Admin user created');
      console.log('   Email: lewmay1@gmail.com');
      console.log('   Role: Admin');
      console.log('   Status: Active');
      console.log('');
      console.log('🔐 IMPORTANT NEXT STEPS:');
      console.log('   1. Log in at /admin/login with the temporary password');
      console.log('   2. Change your password immediately after first login');
      console.log('   3. Remove ADMIN_BOOTSTRAP_PASSWORD from .env.local');
      console.log('   4. This script is now safe to delete (or keep for future environments)');
    } else {
      if (result.error?.includes('already exists')) {
        console.log('ℹ️  Admin user already exists');
        console.log('   Email: lewmay1@gmail.com');
        console.log('   If you need to reset the password, use the "Forgot password" link at /admin/login');
      } else {
        console.error('❌ ERROR:', result.error);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ FATAL ERROR:', error);
    process.exit(1);
  }
}

// Run the bootstrap
bootstrapAdmin()
  .then(() => {
    console.log('✅ Bootstrap complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Bootstrap failed:', error);
    process.exit(1);
  });
