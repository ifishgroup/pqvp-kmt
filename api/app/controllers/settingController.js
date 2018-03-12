/* eslint-disable */

const _ = require('lodash');

const { Settings } = require('../models/settings');

exports.get_all_settings = function(req, res) {
  Settings.getAll()
    .then(all => {
      res.status(200).send(all);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.update_settings = function(req, res) {
    const form = _.pick(req.body, [
      '_id',
      'suggestions',
      'voting',
      'share',
      'featured',
      'top_number',
      'categories',
    ]);
  
    Settings.Update(form)
      .then(() => {
        res.status(200).send();
      })
      .catch(e => {
        res.status(500).send(e);
      });
  };
