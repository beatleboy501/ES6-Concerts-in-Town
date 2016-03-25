'use strict';
import fetch from './fetch';
import prompt, {promptForEvent} from './prompt';

function* generateEvents (events) {
  for (let event of events) {
    yield promptForEvent(event, `
      ${event.id}: ${new Date(event.datetime)}
      ${event.venue.name} ${event.venue.city}, ${event.venue.region}
      Do you want to attend this event? > `);
  }
}

function cycleEvents (it, schedule, done) {
  let result = it.next();

  if (result.done) schedule.save()
    .then(savedSchedule => done(savedSchedule))
    .catch(console.error);

  else result.value
    .then(response => {
      if (response.answer === 'y') schedule.add(response.event);
      cycleEvents(it, schedule, done);
    })
    .catch(err => {
      console.error(err);
      cycleEvents(it, schedule, done);
    });
}

function filterEvents(events, schedule, done, band) {
  prompt('Enter a 2 letter US State abbreviation to filter by > ')
    .then(filtered => {
      events = events.filter(event => event.venue.region === filtered);
      console.log(`\nUpcoming concerts for ${band} in ${filtered}`);
      let it = generateEvents(events);
      cycleEvents(it, schedule, done);
    })
    .catch(error => {
      console.error(error);
      done(schedule);
  });
}

export default function search (schedule, done) {
  let _bandName;
  prompt('Enter an artist to search for > ')
    .then(bandName => {
      _bandName = bandName;
      return fetch(bandName);
    })
    .then(events => {
      events = filterEvents(events, schedule, done, _bandName);
    })
    .catch(error => {
      console.error(error);
      done(schedule);
    });
}
