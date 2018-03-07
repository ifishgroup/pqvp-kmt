/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint-disable */

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

KaSchema.statics.findById = function(id) {
  const KA = this;

  return KA.findOne({
    _id: id,
  }).then(ka => {
    if (!ka) {
      return Promise.reject();
    }

    return ka;
  });
};

KaSchema.statics.getAll = function(user) {
  const KA = this;

  if (user.role === 'contentAuth') {
    return KA.find({ $or: [{ status: { $ne: 'draft' } }, { author_id: { $eq: user._id } }] }).then(
      all => {
        if (!all) {
          return Promise.reject();
        }

        return all;
      },
    );
  } else if (user.role !== 'contentAuth') {
    return KA.find({ author_id: user._id }).then(all => {
      if (!all) {
        return Promise.reject();
      }

      return all;
    });
  }
  return {};
};

KaSchema.statics.findById = function(id, view) {
  const KA = this;

  return KA.findOne({
    _id: id,
  }).then(ka => {
    if (!ka) {
      return Promise.reject();
    }

    if (view) {
      ka.update({ $inc: { viewcount: 1 } }, err => {
        if (err) return Promise.reject();
      });
    }
    return ka;
  });
};

KaSchema.statics.findByIdAndRemove = function(id) {
  const KA = this;

  return KA.remove(
    {
      _id: id,
    },
    err =>
      new Promise((resolve, reject) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      }),
  );
};

KaSchema.statics.UpdateById = function(form) {
  const KA = this;

  return KA.findOne({
    _id: form._id,
  }).then(ka => {
    if (!ka) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      ka.set({
        title: form.title,
        status: form.status,
        content: form.content,
        keywords: form.keywords,
        permalink: form.permalink,
        featured: form.featured,
        last_updated: form.last_updated,
        last_update_user: form.last_update_user,
        published_date: form.published_date,
      });
      ka.save(err => {
        if (err) reject();
        else resolve();
      });
    });
  });
};

KaSchema.statics.getFeatured = function(user) {
  const KA = this;

  return KA.find({ $and: [{ status: { $eq: 'approved' } }, { featured: { $eq: true } }] }).then(
    all => {
      if (!all) {
        return Promise.reject();
      }

      return all;
    },
  );
};

KaSchema.statics.getTop = function(user) {
  const KA = this;

  return KA.find({ $and: [{ status: 'approved' }, { viewcount: { $gt: 0 } }] })
    .sort({ viewcount: -1 })
    .limit(5)
    .then(all => {
      if (!all) {
        return Promise.reject();
      }

      return all;
    });
};

KaSchema.statics.getCategories = function() {
  const KA = this;

  return KA.aggregate([
    { $match: { status: { $eq: 'approved' } } },
    { $project: { _id: 1, title: 1, categories: { $split: ['$keywords', ','] } } },
    { $unwind: '$categories' },
    {
      $group: {
        _id: '$categories',
        titles: { $push: { _id: '$title', data: { articleid: '$_id' } } },
      },
    },
    { $sort: { _id: 1 } },
  ]).then(all => {
    if (!all) {
      return Promise.reject();
    }

    return all;
  });
};

KaSchema.statics.search = function(ka) {
  const KA = this;
  let query = ka.search_terms;

  return KA.find({
    $or: [
      { $and: [{ status: 'approved' }, { title: { $regex: new RegExp(query, 'i') } }] },
      { $and: [{ status: 'approved' }, { keywords: { $regex: new RegExp(query, 'i') } }] },
    ],
  })
    .sort({ viewcount: -1 })
    .then(all => {
      if (!all) {
        return Promise.reject();
      }

      return all;
    });
};

const KA = mongoose.model('KA', KaSchema, 'ka');

module.exports = {
  KA,
};
