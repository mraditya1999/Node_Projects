require('dotenv').config();

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const app = express();
const cors = require('cors');

const connectToDB = require('./db/connect');
const tasks = require('./routes/tasks');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.get('/', (req, res) => {
  res.send('<h1>Tasks API</h1><a href="/api-docs">Documentation</a>');
});
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
