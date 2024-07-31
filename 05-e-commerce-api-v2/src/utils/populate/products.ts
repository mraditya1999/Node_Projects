import { config } from '../../config/config';
import connectToDB from '../../config/db';
import { Product } from '../../models';
import jsonProducts from '../mock-data/products.json';

// populate database config
// to populate database run command - node populate.ts
const init = async () => {
  try {
    await connectToDB(config.databaseUrl);
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
