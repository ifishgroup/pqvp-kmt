/* eslint-disable */
const _ = require('lodash');

const {
  KA,
} = require('../models/ka');

exports.create_article = function (req, res) {
  const body = _.pick(req.body, ['author_id', 'author', 'author_email', 'title', 'status', 'content', 'keywords', 'permalink', 'featured', 'last_updated', 'last_update_user', 'published_date', 'viewcount', 'votes']);
  const ka = new KA(body);

  ka.save().then(() => {
    res.status(200).send();
  }).catch((e) => {
    res.status(500).send(e);
  });
};

exports.get_all_articles = function (req, res) {
  const body = _.pick(req.user, ['_id', 'role']);

  KA.getAll(body).then((all) => {
    res.status(200).send(all);
  }).catch((e) => {
    res.status(500).send(e);
  });
};

exports.edit_article = function (req, res) {
  const id = req.params.id;

  KA.findById(id).then((ka) => {
    res.status(200).send(ka);
  }).catch((e) => {
    res.status(500).send(e);
  });
};
exports.update_article = function (req, res) {
  const form = _.pick(req.body, ['_id', 'author_id', 'author', 'author_email', 'title', 'status', 'content', 'keywords', 'permalink', 'featured', 'last_updated', 'last_update_user', 'published_date']);

  KA.UpdateById(form).then(() => {
    res.status(200).send();
  }).catch((e) => {
    res.status(500).send(e);
  });
};

exports.delete_article = function (req, res) {
  const id = req.params.id;
  const body = _.pick(req.user, ['_id', 'role']);

  KA.findByIdAndRemove(id).then(() => {
    KA.getAll(body).then((all) => {
      res.status(200).send(all);
    });
  }).catch((e) => {
    console.log({ e });
    res.status(500).send(e);
  });
};
