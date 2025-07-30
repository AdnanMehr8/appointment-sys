const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);

  const provider1 = await prisma.user.create({
    data: {
      name: 'Dr. Ahmed',
      email: 'drahmed@example.com',
      password,
      role: 'PROVIDER',
    },
  });

  const provider2 = await prisma.user.create({
    data: {
      name: 'Dr. Ayesha',
      email: 'drayesha@example.com',
      password,
      role: 'PROVIDER',
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: 'Adnan Haider',
      email: 'adnanhaider@example.com',
      password,
      role: 'CUSTOMER',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Alina Khan',
      email: 'alinakhan@example.com',
      password,
      role: 'CUSTOMER',
    },
  });

  await prisma.availability.createMany({
    data: [
      {
        providerId: provider1.id,
        startTime: new Date('2025-08-01T10:00:00Z'),
        endTime: new Date('2025-08-01T11:00:00Z'),
      },
      {
        providerId: provider1.id,
        startTime: new Date('2025-08-01T11:00:00Z'),
        endTime: new Date('2025-08-01T12:00:00Z'),
      },
    ],
  });

  await prisma.appointment.create({
    data: {
      customerId: customer1.id,
      providerId: provider1.id,
      date: new Date('2025-08-01T10:00:00Z'),
      status: 'BOOKED',
    },
  });

  console.log('Seeded successfully');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
