const _ = require('lodash');

var {
  User
} = require('../models/user');

exports.register_user = function (req, res) {
  var body = _.pick(req.body, ['name', 'email', 'password', 'role', 'photo']);
  var user = new User(body);

  user.save().then(() => {
    res.status(200).send();
  }).catch((e) => {
    console.log({e})
    res.status(400).send(e);
  });

  // user.save().then(() => {
  //   return user.generateAuthToken();
  // }).then((token) => {
  //   //res.header('x-auth', token).send(user);
  //   res.status(200).send();
  // }).catch((e) => {
  //   res.status(400).send(e);
  // })
}

exports.login_user = function (req, res) {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(401).send(e);
  });
};

exports.delete_user = function (req, res) {
  var id = req.params.id;

  User.findByIdAndRemove(id).then(() => {
    User.getAll().then((all) => {
      res.status(200).send(all);
    })
  }).catch((e) => {
    res.status(500).send(e);
  });
};

exports.edit_user = function (req, res) {
  var id = req.params.id;

  User.findById(id).then((user) => {
    res.status(200).send(user);
  }).catch((e) => {
    res.status(500).send(e);
  });
};

exports.update_user = function (req, res) {
  var id = req.params.id;
  var form = _.pick(req.body, ['_id','name', 'email', 'password', 'role']);
  console.log(form);
  User.UpdateById(form).then(() => {
    res.status(200).send();
  }).catch((e) => {
    console.log(e)
    res.status(500).send(e);
  });
};

exports.get_user_info = function (req, res) {
  res.send(req.user);
};

exports.get_all_users = function (req, res) {
  User.getAll().then((all) => {
    res.status(200).send(all);
  }).catch((e) => {
    res.status(401).send(e);
  });
};

exports.logout_user = function (req, res) {

  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(401).send(e);
  });

};
