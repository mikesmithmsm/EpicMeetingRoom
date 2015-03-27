var express = require('express');
var router = express.Router();
var Resources = require('../models/resources');
var ical = require('ical')

router.route('/:id').get(function(req, res, next) {
  Resources.findOne({id: req.params.id}, function(err, resource) {
    if (err) {
      return res.send(err);
    }

    ical.fromURL(resource.url, {}, function(err, data) {
      console.log('got some data from ical')
      for (var k in data){
        if (data.hasOwnProperty(k)) {
          var ev = data[k]
          console.log("Conference",
            ev.summary,
            'is in',
            ev.location,
            'on the', ev.start );
        }
      }
      res.render('resource', {resource: JSON.stringify(data)});
    });
  });
});


module.exports = router;
