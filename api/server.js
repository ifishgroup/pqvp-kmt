require('./app/config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./app/db/mongoose');

var app = express();

app.use(bodyParser.json());

const host = process.env.BASE_URL;
const port = process.env.PORT;
const apiPath = process.env.API_PATH;

app.use(function(req, res, next) {
  res.header("Access-Control-Expose-Headers", 'x-auth');
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-auth");
  next();
});

var routes = require('./app/routes/apiRoutes'); //importing route
routes(app); //register the route

app.listen(port, () => {});

if (process.env.NODE_ENV !== 'production') {
  console.log(`\n Your api is running here http://${host}:${port}/${apiPath}\n`);
  console.log(`\n Your api documentation is running here http://${host}:${port}/${apiPath}/docs\n`);
}
module.exports = { app };
