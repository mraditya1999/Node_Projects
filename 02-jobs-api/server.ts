import app from './src/app';
import connectToDB from './src/config/db';
import { config } from './src/config/config';

// run only first time then comment out this line
// import './src/utils/populate/jobs'; // populate database with jobs

const startServer = async () => {
  try {
    await connectToDB(config.databaseUrl);
    const port = config.port || 3000;
    app.listen(port, () => {
      console.log(`Server is listening on port: http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
