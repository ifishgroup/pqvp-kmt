require('./app/config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./app/db/mongoose');

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT;

app.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'x-auth');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth');
  // intercepts OPTIONS method
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

const routes = require('./app/routes/apiRoutes');
// importing route
routes(app); // register the route

app.listen(port, () => {
  console.log(`\n Your api is running here http://localhost:${port}/api\n`);
  console.log(`\n Your api documentation is running here http://localhost:${port}/api/docs\n`);
});

module.exports = { app };
