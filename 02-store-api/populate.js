require('dotenv').config();
const connectToDB = require('./db/connect');
const Product = require('./models/product');
const jsonProducts = require('./products.json');

// populate database config
const init = async () => {
  try {
    await connectToDB(process.env.MONGODB_URI);
    await Product.deleteMany();
    await Product.create(jsonProducts);
    console.log('Populate database successfully...');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

init();
