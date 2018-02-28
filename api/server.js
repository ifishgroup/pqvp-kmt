require('./app/config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./app/db/mongoose');

var app = express();

app.use(bodyParser.json());

const port = process.env.PORT;

app.use(function(req, res, next) {
  res.header("Access-Control-Expose-Headers", 'x-auth');
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-auth");
  next();
});

var routes = require('./app/routes/apiRoutes'); //importing route
routes(app); //register the route

app.listen(port, () => {
  console.log(`\n Your api is running here http://localhost:${port}/api` + `\n`);
  console.log(`\n Your api documentation is running here http://localhost:${port}/api/docs` + `\n`);
});

module.exports = {app};
