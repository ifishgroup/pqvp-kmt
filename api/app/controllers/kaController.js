/* eslint-disable */
const _ = require('lodash');

const { KA } = require('../models/ka');

exports.create_article = function(req, res) {
  const body = _.pick(req.body, [
    'author_id',
    'author',
    'author_email',
    'title',
    'status',
    'content',
    'keywords',
    'attachment',
    'featured',
    'last_updated',
    'last_update_user',
    'published_date',
    'viewcount',
    'votes',
  ]);

  const ka = new KA(body);

  ka
    .save()
    .then(() => {
      res.status(200).send();
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.create_attachment = function(req, res) {
  
  let body = _.pick(JSON.parse(req.body['newArticle']), [
    'author_id',
    'author',
    'author_email',
    'title',
    'status',
    'content',
    'keywords',
    'attachment',
    'featured',
    'last_updated',
    'last_update_user',
    'published_date',
    'viewcount',
    'votes',
  ]);

  body.attachment = req.file.filename;

  const ka = new KA(body);

  ka
    .save()
    .then(() => {
      res.status(200).send();
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.get_all_articles = function(req, res) {
  const body = _.pick(req.user, ['_id', 'role']);

  KA.getAll(body)
    .then(all => {
      res.status(200).send(all);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.edit_article = function(req, res) {
  const id = req.params.id;

  KA.findById(id, false)
    .then(ka => {
      res.status(200).send(ka);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.read_article = function(req, res) {
  const id = req.params.id;

  KA.findById(id, true)
    .then(ka => {
      res.status(200).send(ka);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.update_article = function(req, res) {
  const form = _.pick(req.body, [
    '_id',
    'author_id',
    'author',
    'author_email',
    'title',
    'status',
    'content',
    'keywords',
    'attachment',
    'featured',
    'last_updated',
    'last_update_user',
    'published_date',
  ]);

  KA.UpdateById(form)
    .then(() => {
      res.status(200).send();
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.update_status = function(req, res) {
  const form = _.pick(req.body, ['articleid', 'status', 'user']);

  KA.UpdateStatusById(form)
    .then(() => {
      res.status(200).send();
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.delete_article = function(req, res) {
  const id = req.params.id;
  const body = _.pick(req.user, ['_id', 'role']);

  KA.findByIdAndRemove(id)
    .then(() => {
      KA.getAll(body).then(all => {
        res.status(200).send(all);
      });
    })
    .catch(e => {
      console.log({ e });
      res.status(500).send(e);
    });
};

exports.get_featured = function(req, res) {
  KA.getFeatured()
    .then(all => {
      res.status(200).send(all);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.get_top = function(req, res) {
  KA.getTop()
    .then(all => {
      res.status(200).send(all);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.search = function(req, res) {
  const body = _.pick(req.body, ['search_terms']);

  KA.search(body)
    .then(all => {
      res.status(200).send(all);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};
exports.capture_vote = function(req, res) {
  const body = _.pick(req.body, ['articleid', 'tally']);
  KA.findById(body.articleid, false)
    .then(ka => {
      ka.update({ $inc: { votes: body.tally } }, err => {
        if (err) res.status(500).send(err);
        else res.status(200).send();
      });
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.get_featured = function(req, res) {
  KA.getFeatured()
    .then(all => {
      res.status(200).send(all);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.get_top = function(req, res) {
  KA.getTop()
    .then(all => {
      res.status(200).send(all);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.search = function(req, res) {
  const body = _.pick(req.body, ['search_terms']);

  KA.search(body)
    .then(all => {
      res.status(200).send(all);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.get_categories = function(req, res) {
  KA.getCategories()
    .then(all => {
      res.status(200).send(all);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.get_dashboard_totals = function(req, res) {
  
  KA.getDashTotals()
    .then(all => {
      res.status(200).send(all);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.get_dashboard_views = function(req, res) {
  
  KA.getDashViews()
    .then(all => {
      res.status(200).send(all);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

exports.get_dashboard_votes = function(req, res) {
  
  KA.getDashVotes()
    .then(all => {
      res.status(200).send(all);
    })
    .catch(e => {
      res.status(500).send(e);
    });
};

