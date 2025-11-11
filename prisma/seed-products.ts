import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting products seed...');

  // Clear existing products and related data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // Create Products
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'MacBook Pro 16"',
        description: 'Powerful laptop for developers and creative professionals with M2 Pro chip',
        price: 2399.99,
        stock: 15,
        category: 'Electronics',
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking and long battery life',
        price: 49.99,
        stock: 50,
        category: 'Electronics',
      },
      {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard with cherry MX switches for gaming and typing',
        price: 129.99,
        stock: 25,
        category: 'Electronics',
      },
      {
        name: '4K Monitor',
        description: '27-inch 4K UHD monitor with HDR support and slim bezels',
        price: 399.99,
        stock: 10,
        category: 'Electronics',
      },
      {
        name: 'Office Chair',
        description: 'Ergonomic office chair with lumbar support and adjustable height',
        price: 199.99,
        stock: 8,
        category: 'Furniture',
      },
      {
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness and color temperature',
        price: 29.99,
        stock: 30,
        category: 'Home',
      },
      {
        name: 'Water Bottle',
        description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours',
        price: 24.99,
        stock: 100,
        category: 'Accessories',
      },
      {
        name: 'Backpack',
        description: 'Water-resistant backpack with laptop compartment and multiple pockets',
        price: 79.99,
        stock: 20,
        category: 'Accessories',
      },
    ],
  });

  console.log('Products seed completed successfully!');
  console.log(`Created ${(await prisma.product.count())} products`);
  
  // List the products
  const allProducts = await prisma.product.findMany();
  console.log('\nAvailable products:');
  allProducts.forEach(product => {
    console.log(`- ${product.name}: $${product.price} (Stock: ${product.stock})`);
  });
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });