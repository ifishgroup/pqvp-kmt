module.exports = function (app) {

  var {authenticate} = require('../middleware/authenticate');
  var userController = require('../controllers/userController');
  var kaController = require('../controllers/kaController');

  var swaggerUi = require('swagger-ui-express');
  var swaggerDocument = require('../../swagger.json');

  app.route('/users/login')
    .post(userController.login_user);

  app.route('/users/create')
    .post(authenticate,userController.register_user);

  app.route('/users/delete/:id')
    .get(authenticate,userController.delete_user);

  app.route('/users/edit/:id')
    .get(authenticate,userController.edit_user);

  app.route('/users/edit/:id')
    .post(authenticate,userController.update_user);

  app.route('/users/all')
    .get(authenticate,userController.get_all_users);

  app.route('/users/me')
    .get(authenticate, userController.get_user_info);

  app.route('/users/logout')
    .delete(authenticate,userController.logout_user);

  app.route('/articles/create')
    .post(authenticate,kaController.create_article);

  app.route('/articles/edit/:id')
    .get(authenticate,kaController.edit_article);

  app.route('/articles/edit/:id')
    .post(authenticate,kaController.update_article);

  app.route('/articles/delete/:id')
    .get(authenticate,kaController.delete_article);

  app.route('/articles/all')
    .get(authenticate,kaController.get_all_articles);
  //setup swagger documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  //add url prefix '/api' to routes
  app.use('/api', app._router);
};
