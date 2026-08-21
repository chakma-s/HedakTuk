import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create a dummy User (Owner)
  const owner = await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {},
    create: {
      name: 'Restaurant Owner',
      phone: '9999999999',
      role: 'RESTAURANT_OWNER',
    },
  });

  // 2. Create a dummy Restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      ownerId: owner.id,
      name: 'Spicy Corner',
      description: 'The best spicy food in town',
      address: '123 Main St, Cityville',
      latitude: 12.9716,
      longitude: 77.5946,
      rating: 4.5,
      cuisines: ['Indian', 'Chinese'],
      deliveryFee: 40,
      minOrderAmount: 150,
      coverImageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800',
    },
  });

  // 3. Create Menu Categories
  const catStarters = await prisma.menuCategory.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Starters',
      sortOrder: 1,
    }
  });

  const catMains = await prisma.menuCategory.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Main Course',
      sortOrder: 2,
    }
  });

  // 4. Create Menu Items
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurant.id,
        categoryId: catStarters.id,
        name: 'Paneer Tikka',
        description: 'Grilled cottage cheese marinated in spices',
        price: 250,
        isVeg: true,
      },
      {
        restaurantId: restaurant.id,
        categoryId: catStarters.id,
        name: 'Chicken 65',
        description: 'Spicy deep fried chicken',
        price: 300,
        isVeg: false,
      },
      {
        restaurantId: restaurant.id,
        categoryId: catMains.id,
        name: 'Butter Chicken',
        description: 'Rich tomato gravy with tender chicken',
        price: 400,
        isVeg: false,
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
