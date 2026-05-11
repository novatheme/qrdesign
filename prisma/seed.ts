import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Clean up
  await prisma.transaction.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.merchant.deleteMany();

  // Create Admin
  const admin = await prisma.merchant.create({
    data: {
      email: 'admin@vietqr.com',
      password: hashedPassword,
      businessName: 'VietQR Admin HQ',
      apiKey: 'pk_admin_master',
      role: 'ADMIN' as any,
    },
  });

  // Create Merchants
  const m1 = await prisma.merchant.create({
    data: {
      email: 'saigon.coffee@example.com',
      password: hashedPassword,
      businessName: 'Coffee Saigon',
      apiKey: 'pk_live_saigon_123',
    },
  });

  const m2 = await prisma.merchant.create({
    data: {
      email: 'hanoi.bakery@example.com',
      password: hashedPassword,
      businessName: 'Hanoi Bakery',
      apiKey: 'pk_live_hanoi_456',
    },
  });

  // Add Bank Accounts
  await prisma.bankAccount.create({
    data: {
      merchantId: m1.id,
      bankCode: 'VCB',
      accountNumber: '113366668888',
      accountName: 'COFFEE SAIGON LTD',
      isDefault: true,
    },
  });

  // Create some transactions
  await prisma.transaction.create({
    data: {
      merchantId: m1.id,
      bankCode: 'VCB',
      accountNumber: '113366668888',
      amount: 45000,
      description: 'Phê La - Order #552',
      status: 'SUCCESS',
      qrPayload: '00020101021238540010A0000007270124000697043601101133666688880208QRIBFTTA5204731153037045802VN62180814Phê La - Order #5526304ED01',
    },
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
