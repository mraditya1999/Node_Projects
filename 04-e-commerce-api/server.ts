import app from './src/app';
import { connectToDB, config } from './src/config';

// run only first time then comment out this line
// import './src/utils/populate/products'; // populate database with products
// import './src/utils/populate/orders'; // populate database with users

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
