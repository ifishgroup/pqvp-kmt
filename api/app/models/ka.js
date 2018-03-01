/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const mongoose = require('mongoose');
const validator = require('validator');

const KaSchema = new mongoose.Schema({
  author_id: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  author_email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: false,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  keywords: {
    type: String,
    required: true,
    trim: true,
  },
  permalink: {
    type: String,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  last_updated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  last_update_user: {
    type: String,
    required: true,
    trim: true,
  },
  published_date: {
    type: Date,
  },
  viewcount: {
    type: Number,
    required: true,
    default: 0,
  },
  votes: {
    type: Number,
    required: true,
    default: 0,
  },
});

KaSchema.statics.findById = function (id) {
  const KA = this;

  return KA.findOne({
    _id: id,
  }).then((ka) => {
    if (!ka) {
      return Promise.reject();
    }

    return ka;
  });
};

KaSchema.statics.getAll = function (user) {
  const KA = this;

  if (user.role === 'contentAuth') {
    return KA.find({ $or: [{ status: { $ne: 'draft' } }, { author_id: { $eq: user._id } }] }).then((all) => {
      if (!all) {
        return Promise.reject();
      }

      return all;
    });
  } else if (user.role === 'authorAuth') {
    return KA.find({ author_id: user._id }).then((all) => {
      if (!all) {
        return Promise.reject();
      }

      return all;
    });
  }
  return {};
};

KaSchema.statics.findById = function (id) {
  const KA = this;

  return KA.findOne({
    _id: id,
  }).then((ka) => {
    if (!ka) {
      return Promise.reject();
    }

    return ka;
  });
};

KaSchema.statics.findByIdAndRemove = function (id) {
  const KA = this;

  return KA.remove({
    _id: id,
  }, err => new Promise((resolve, reject) => {
    if (err) { reject(); } else { resolve(); }
  }));
};

KaSchema.statics.UpdateById = function (form) {
  const KA = this;

  return KA.findOne({
    _id: form._id,
  }).then((ka) => {
    if (!ka) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      ka.set({ title: form.title, status: form.status, content: form.content, keywords: form.keywords, permalink: form.permalink, featured: form.featured, last_updated: form.last_updated, last_update_user: form.last_update_user, published_date: form.published_date });
      ka.save((err) => { if (err) reject(); else resolve(); });
    });
  });
};

const KA = mongoose.model('KA', KaSchema, 'ka');

module.exports = {
  KA,
};
