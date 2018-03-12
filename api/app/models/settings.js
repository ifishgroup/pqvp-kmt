/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint-disable */

const mongoose = require('mongoose');
const validator = require('validator');

const SettingsSchema = new mongoose.Schema({
  suggestions: {
    type: Boolean,
    require: true,
  },
  voting: {
    type: Boolean,
    require: true,
  },
  share: {
    type: Boolean,
    require: true,
  },
  featured: {
    type: Boolean,
    require: true,
  },
  top_number: {
    type: Number,
    require: true,
  },
  categories: {
    type: Boolean,
    require: true,
  },
});

SettingsSchema.statics.getAll = function() {
  const Setting = this;

  return Setting.find({}).then(all => {
    if (!all) {
      return Promise.reject();
    }

    return all;
  });
};

SettingsSchema.statics.Update = function(form) {
  const Setting = this;

  return Setting.findOne({ _id: form._id }).then(setting => {
    if (!setting) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      setting.set({
        suggestions: form.suggestions,
        voting: form.voting,
        share: form.share,
        featured: form.featured,
        top_number: form.top_number,
        categories: form.categories,
      });
      setting.save(err => {
        if (err) reject();
        else resolve();
      });
    });
  });
};

const Settings = mongoose.model('Settings', SettingsSchema, 'settings');

module.exports = {
  Settings,
};
