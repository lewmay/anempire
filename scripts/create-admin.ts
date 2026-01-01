import { createAdminUser } from '../lib/auth/service';

async function main() {
  const email = process.env.INITIAL_ADMIN_EMAIL || 'admin@anempire.com';
  const password = process.argv[2] || 'changeme123';
  const name = process.argv[3] || 'Admin';
  const role = (process.argv[4] === 'system_user' ? 'system_user' : 'admin') as 'admin' | 'system_user';

  console.log(`Creating ${role} user: ${email}`);

  const result = await createAdminUser(email, password, name, role);

  if (result.success) {
    console.log(`✓ ${role === 'admin' ? 'Admin' : 'System'} user created successfully`);
    console.log('');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);
    console.log('');
    console.log('⚠️  IMPORTANT: Change your password after first login!');
    console.log('');
    console.log('Login at: http://localhost:3000/admin/login');
  } else {
    console.error('✗ Failed to create user:', result.error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
