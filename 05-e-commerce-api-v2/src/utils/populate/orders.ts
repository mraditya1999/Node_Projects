import { config } from '../../config';
import connectToDB from '../../config/db';
import { Order } from '../../models';
import jsonOrders from '../mockData/orders.json';

// populate database config
// to populate database run command - node populate.ts
const init = async () => {
  try {
    await connectToDB(config.databaseUrl);
    await Order.deleteMany();
    await Order.create(jsonOrders);
    console.log('Populate database successfully...');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

init();
