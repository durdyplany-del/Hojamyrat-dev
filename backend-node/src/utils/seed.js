const { sequelize, User, Product, Sale } = require('../models');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    await sequelize.sync({ force: true });
    console.log('✅ Tables created');

    const existingUser = await User.findOne({ where: { username: 'admin' } });
    if (!existingUser) {
      await User.create({
        username: 'admin',
        password: 'test123',
        name: 'Administrator'
      });
      console.log('✅ User created');
    } else {
      console.log('✅ User already exists');
    }

    const existingProducts = await Product.count();
    if (existingProducts === 0) {
      await Product.bulkCreate([
        { name: 'Telefon', quantity: 50, buyPrice: 1000, sellPrice: 1500 },
        { name: 'Noutjuk', quantity: 20, buyPrice: 5000, sellPrice: 7000 },
        { name: 'Kompýuter', quantity: 30, buyPrice: 3000, sellPrice: 4500 },
        { name: 'Monitor', quantity: 40, buyPrice: 800, sellPrice: 1200 },
        { name: 'Klawiatura', quantity: 100, buyPrice: 100, sellPrice: 200 }
      ]);
      console.log('✅ Products created');
    } else {
      console.log('✅ Products already exist');
    }

    console.log('✅ Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
