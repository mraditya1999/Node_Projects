require('dotenv').config();
const express = require('express');
const app = express();
const tasks = require('./routes/tasks');
const connectToDB = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const cors = require('cors');

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

// routes
app.use('/api/v1/tasks', tasks);

// custom middlewares
app.use(notFound);
app.use(errorHandlerMiddleware);

// server config
const PORT = process.env.PORT || 3000;
const init = async () => {
  try {
    await connectToDB(process.env.MONGODB_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error(error);
  }
};

init();
