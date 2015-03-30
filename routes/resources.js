var express = require('express');
var router = express.Router();
var Resources = require('../models/resources');
var icalendar = require('icalendar')
var request = require('request');

router.route('/:id').get(function(req, res, next) {
  Resources.findOne({id: req.params.id}, function(err, resource) {
    if (err) {
      return res.send(err);
    }

    request(resource.url, function (error, response, data) {
      var ical = icalendar.parse_calendar(data);
      console.log('parsed' +ical.events().length  )
      res.render('resource', {events: ical.events()});
      events = ical.events();


      now = findEvent(events, new Date(), plusOneMinute(new Date()));

      console.log('got now '+now.getPropertyValue('SUMMARY'))

      if (now != null) {
        var dtend = now.getPropertyValue('DTEND');
        dtend = new Date(dtend.valueOf());
        next = findEvent(events, dtend, plusOneMinute(dtend));

        console.log('got next '+next.getPropertyValue('SUMMARY'))
      }
      
    })
  });
});

function plusOneMinute(time) {
  return time.setTime(time.getTime() + 1000 * 60);
}

function findEvent(events, startTime, endTime) {
  var toReturn = null;
  events.forEach(function(event) {
    if (event.inTimeRange(startTime, endTime)) {
      toReturn =  event;
    }
  });

  return toReturn;
}

module.exports = router;
