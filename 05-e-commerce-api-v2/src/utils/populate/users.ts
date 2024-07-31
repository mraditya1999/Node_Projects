import { config } from '../../config/config';
import connectToDB from '../../config/db';
import User from '../../models/users.model';
import jsonUsers from '../mock-data/users.json';

// populate database config
// to populate database run command - node populate.ts
const init = async () => {
  try {
    await connectToDB(config.databaseUrl);
    await User.deleteMany();
    await User.create(jsonUsers);
    console.log('Populate database successfully...');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

init();
