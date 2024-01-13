require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const connectToDB = require('./db/connect');
const products = require('./routes/products');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middlewares
app.use(express.json());

// routes
app.use('/', (req, res) => {
  res.redirect('/api/v1/products'); // Redirect requests from the root path (/) to /api/v1/products
});
app.use('/api/v1/products', products);

// custom middlewares
app.use(notFound);
app.use(errorHandlerMiddleware);

// server config
const PORT = process.env.PORT || 3000;
const init = async () => {
  try {
    await connectToDB(process.env.MONGODB_URI);
    app.listen(
      PORT,
      console.log(`Server is listening on port http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error(error);
  }
};

init();
