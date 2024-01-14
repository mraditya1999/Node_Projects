require('dotenv').config();

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const app = express();

// db
const connectToDB = require('./db/connect');

// routers
const tasks = require('./routes/tasks');

// error handler
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middlewares
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.static('./public'));
app.use(express.json());
app.use(helmet());
app.use(cors());
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
