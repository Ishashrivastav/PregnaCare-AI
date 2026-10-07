import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbUrl = process.env.DATABASE_URL || '';
const prismaDir = path.join(__dirname, '../prisma');
const schemaTarget = path.join(prismaDir, 'schema.prisma');
const sqliteSchema = path.join(prismaDir, 'schema.sqlite.prisma');
const pgSchema = path.join(prismaDir, 'schema.pg.prisma');

// Backup pg schema if not already backed up
if (!fs.existsSync(pgSchema) && fs.existsSync(schemaTarget)) {
  const current = fs.readFileSync(schemaTarget, 'utf-8');
  if (current.includes('postgresql')) {
    fs.writeFileSync(pgSchema, current);
  }
}

console.log(`🔍 Database configuration: ${dbUrl ? (dbUrl.startsWith('file:') ? 'SQLite' : 'PostgreSQL (from DATABASE_URL)') : 'Default (PostgreSQL / schema.prisma)'}`);

if (dbUrl && (dbUrl.startsWith('file:') || dbUrl.includes('.db'))) {
  console.log('🔄 Configuring Prisma for local SQLite database...');
  if (fs.existsSync(sqliteSchema)) {
    fs.copyFileSync(sqliteSchema, schemaTarget);
  }
} else if (fs.existsSync(pgSchema)) {
  console.log('🐘 Configuring Prisma for PostgreSQL database...');
  fs.copyFileSync(pgSchema, schemaTarget);
}

try {
  console.log('⚙️  Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  
  if (!process.env.VERCEL && !process.env.SKIP_DB_PUSH) {
    try {
      console.log('🚀 Pushing database schema...');
      execSync('npx prisma db push --skip-generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    } catch (pushErr) {
      console.warn('⚠️ Could not connect to database to push schema directly. Skipping push for build step.');
    }
  }
  
  console.log('✅ Database setup successfully initialized.');
} catch (error) {
  console.error('❌ Failed to prepare database:', error.message);
  process.exit(1);
}
