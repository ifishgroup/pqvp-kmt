/* eslint no-underscore-dangle: ["error", { "allow": ["_router"] }] */
/* eslint-disable func-names */

const { authenticate } = require('../middleware/authenticate');
const userController = require('../controllers/userController');
const kaController = require('../controllers/kaController');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');

module.exports = function (app) {
  app.route('/').get((req, res) => {
    res.status(200).send('Insight API "api_v1" has been setup successfully.');
  });

  app.route('/users/login').post(userController.login_user);

  app.route('/users/create').post(authenticate, userController.register_user);

  app.route('/users/delete/:id').get(authenticate, userController.delete_user);

  app.route('/users/edit/:id').get(authenticate, userController.edit_user);

  app.route('/users/edit/:id').post(authenticate, userController.update_user);

  app.route('/users/all').get(authenticate, userController.get_all_users);

  app.route('/users/me').get(authenticate, userController.get_user_info);

  app.route('/users/logout').delete(authenticate, userController.logout_user);

  app.route('/articles/create').post(authenticate, kaController.create_article);

  app.route('/articles/edit/:id').get(authenticate, kaController.edit_article);

  app.route('/articles/edit/:id').post(authenticate, kaController.update_article);

  app.route('/articles/update').post(authenticate, kaController.update_status);

  app.route('/articles/delete/:id').get(authenticate, kaController.delete_article);

  app.route('/articles/search').post(kaController.search);

  app.route('/articles/featured').get(kaController.get_featured);

  app.route('/articles/top').get(kaController.get_top);

  app.route('/articles/all').get(authenticate, kaController.get_all_articles);

  app.route('/articles/read/:id').get(kaController.read_article);

  app.route('/articles/categories').get(kaController.get_categories);

  app.route('/articles/vote').post(kaController.capture_vote);

  // setup swagger documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // add url prefix '/api' to routes
  app.use('/api', app._router);
};
