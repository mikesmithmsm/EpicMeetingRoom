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
      res.render('resource', {events: ical.events()});
      events = ical.events();

      var currentDateTime = new Date( 2015, 2, 30, 08, 15, 0, 0 )
      var endOfDayDateTime = new Date( 2015, 2, 30, 23, 25, 0, 0 );
      var currentEvent = null;
      var nextEvent = null;
      var currentIndex = 0;      
      var found = false;

      eventsInRange = findEvent(events, currentDateTime, endOfDayDateTime);

      eventsInRange.forEach(function(event, index) {
        if (event.inTimeRange(currentDateTime, plusOneMinute(currentDateTime))) {
          currentIndex = index;
          found = true;
          currentEvent = event;
        }
      });

      if (!found) {
        eventsInRange = findEvent(events, currentDateTime, endOfDayDateTime);
        if (eventsInRange.length > 0) {
          nextEvent = eventsInRange[0];
        }
      } else {
        nextEvent = eventsInRange[currentIndex+1];
      }

      console.log('>> NOW is '+currentEvent+', NEXT is '+nextEvent);

      res.render('resource', {now: currentEvent, next: nextEvent, resource: resource});
    })
  });
});

function printEvent(eventName, event) {
  if(event != null){
    console.log(eventName + " = "+event.getPropertyValue("SUMMARY") + ", startDate id "+event.getPropertyValue('DTSTART') + ", endDate is "+event.getPropertyValue('DTEND') );  
  }else{
    console.log(eventName + " is NULL");
  }
}

function plusOneMinute(time) {
  t = time.getTime();
  return new Date(t + (1000 * 60));
}

function findEvent(events, startTime, endTime) {
  var eventsInDateRange = [];
  events.forEach(function(event) {
    if (event.inTimeRange(startTime, endTime)) {
      eventsInDateRange.push(event);
    }
  });

  eventsInDateRange.sort(function(a, b) {
    var aDate = a.getPropertyValue('DTSTART')
    var bDate = b.getPropertyValue('DTSTART')
    if (aDate.getHours() == bDate.getHours()) {
       return aDate.getMinutes() - bDate.getMinutes();
    }

    return aDate.getHours() - bDate.getHours();
  });

  return eventsInDateRange;
}


module.exports = router;
