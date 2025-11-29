import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Create categories
  const phone = await prisma.category.create({ data: { name: 'Phones' } });
  const laptop = await prisma.category.create({ data: { name: 'Laptops' } });
  const accessories = await prisma.category.create({ data: { name: 'Accessories' } });
  const components = await prisma.category.create({ data: { name: 'Components' } });
  const speakers = await prisma.category.create({ data: { name: 'Speakers' } });
  await prisma.category.create({ data: { name: 'Others' } });


  // Create suppliers
  const supplier1 = await prisma.supplier.create({
    data: { name: 'Apple', contact: 'contact@apple.com' },
  });
  const supplier2 = await prisma.supplier.create({
    data: { name: 'Samsung', contact: 'contact@samsung.com' },
  });

  // Create products
  await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro',
      price: 999,
      cost: 799,
      quantity: 50,
      imageUrl: 'https://via.placeholder.com/150',
      categoryId: phone.id,
      supplierId: supplier1.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'MacBook Pro 16',
      price: 2499,
      cost: 2000,
      quantity: 30,
      imageUrl: 'https://via.placeholder.com/150',
      categoryId: laptop.id,
      supplierId: supplier1.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Samsung Galaxy S24',
      price: 899,
      cost: 700,
      quantity: 60,
      imageUrl: 'https://via.placeholder.com/150',
      categoryId: phone.id,
      supplierId: supplier2.id,
    },
  });

    await prisma.product.create({
    data: {
      name: 'AirPods Pro',
      price: 249,
      cost: 200,
      quantity: 100,
      imageUrl: 'https://via.placeholder.com/150',
      categoryId: accessories.id,
      supplierId: supplier1.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'M3 Chip',
      price: 699,
      cost: 500,
      quantity: 20,
      imageUrl: 'https://via.placeholder.com/150',
      categoryId: components.id,
      supplierId: supplier1.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'HomePod',
      price: 299,
      cost: 250,
      quantity: 40,
      imageUrl: 'https://via.placeholder.com/150',
      categoryId: speakers.id,
      supplierId: supplier1.id,
    },
  });


  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
