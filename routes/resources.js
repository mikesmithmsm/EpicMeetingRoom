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
      events = [];
      for (var k in data){
      if (data.hasOwnProperty(k)) {
          var ev = data[k]
          events.push(new CalendarEntry(ev));
        }
      }
      console.log(events.length+' '+events[0].summary)
      res.render('resource', {events: events});
    });
  });
});

CalendarEntry = function(event) {
  this.event = JSON.stringify(event);
  this.summary = event.summary;
  this.organiser = null;
  this.startTime = event.start;
  this.endTime = event.end
}


module.exports = router;
