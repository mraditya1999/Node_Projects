import { config } from '../../config/config';
import connectToDB from '../../config/db';
import Job from '../../models/job.models';
import jsonJobs from '../mock-data/jobs.json';

// populate database config
// to populate database run command - node populate.ts
const init = async () => {
  try {
    await connectToDB(config.databaseUrl);
    await Job.deleteMany();
    await Job.create(jsonJobs);
    console.log('Populate database successfully...');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

init();
