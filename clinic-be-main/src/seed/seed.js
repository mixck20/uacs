import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

async function run() {
  await connectDB();
  const email = process.env.SEED_ADMIN_EMAIL || `admin@${env.ALLOWED_EMAIL_DOMAIN}`;
  const name = process.env.SEED_ADMIN_NAME || 'Clinic Admin';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name, email, role: 'admin', passwordHash });
  console.log('✅ Admin created:', email, 'password:', password);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
