var express = require('express');
var router = express.Router();
var Resources = require('../models/resources');

/* GET home page. */
router.get('/', function(req, res, next) {
   Resources.find(function(err, resources) {
    if (err) {
      return res.send(err);
    }

    res.render('index', { title: 'Epic Meeting Room', resources: resources });
  });
});

module.exports = router;
