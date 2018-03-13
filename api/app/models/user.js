/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint-disable */
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 1,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
  },
  role: {
    type: String,
    require: true,
  },
  photo: {
    type: String,
    required: false,
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'name', 'email', 'role', 'photo']);
};

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
        access,
      },
      process.env.JWT_SECRET,
    )
    .toString();

  user.tokens.push({
    access,
    token,
  });

  return user.save().then(() => token);
};

UserSchema.methods.removeToken = function(deletetoken) {
  const user = this;

  return user.update({
    $pull: {
      tokens: {
        token: deletetoken,
      },
    },
  });
};

UserSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

UserSchema.statics.findByCredentials = function(email, password) {
  const User = this;

  return User.findOne({
    email,
  }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.statics.findById = function(id) {
  const User = this;

  return User.findOne({
    _id: id,
  }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    return user;
  });
};

UserSchema.statics.UpdateById = function(form) {
  const User = this;

  return User.findOne({
    _id: form._id,
  }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      user.set({ name: form.name, role: form.role, password: form.password });
      user.save(err => {
        if (err) reject();
        else resolve();
      });
    });
  });
};

UserSchema.statics.findByIdAndRemove = function(id) {
  const User = this;

  return User.remove(
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

UserSchema.statics.getAll = function() {
  const User = this;

  return User.find({}).then(all => {
    if (!all) {
      return Promise.reject();
    }

    return all;
  });
};

UserSchema.statics.getAuthor = function() {
  const User = this;

  return User.findOne({ role: 'authorAuth' }, { name: 1, email: 1 }).then(all => {
    if (!all) {
      return Promise.reject();
    }

    return all;
  });
};

UserSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (errr, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {
  User,
};
