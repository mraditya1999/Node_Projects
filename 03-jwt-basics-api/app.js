require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const connectToDB = require('./db/connect');
const authRoutes = require('./routes/main');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.static('./public'));
app.use(express.json());

// routes
app.use('/api/v1', authRoutes);

// custom middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const init = async () => {
  try {
    await connectToDB(process.env.MONGODB_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

init();
