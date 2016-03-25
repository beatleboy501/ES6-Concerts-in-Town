'use strict';

import * as fs from 'fs';
import prompt from './prompt';

export default class Schedule {
  constructor (events=[]) {
    this.schedule = events;
  }

  add (event) {
    this.schedule.push(event);
    console.log('Added to schedule!');
  }

  remove(schedule, main) {
    prompt('Which item number would you like to remove? > ')
      .then(itemNumber => {
        let index = itemNumber - 1;
        if (index > -1) {
          var removed = this.schedule[index]
          this.schedule.splice( index, 1 )[0];
          console.log('Removed item \n' + removed + '\n...');
          schedule.save();
        }
        return main(schedule);
      })
      .catch(error => {
        console.error(error);
      });
  }

  log() {
    if (!this.schedule.length) return console.log('\nNo events currently scheduled\n');
    console.log('Your schedule: \n');
    for (let event of this.schedule) {
      console.log(`
        ${this.schedule.indexOf(event) + 1}.) ${event.artists[0].name}: ${new Date(event.datetime)}
        ${event.venue.name} ${event.venue.city}, ${event.venue.region}
      `);
    }
  }

  save () {
    return new Promise ((resolve, reject) => {
      fs.writeFile('./schedule.json', JSON.stringify(this.schedule), 'utf8', error => {
        if (error) reject(error);
        resolve(this);
      });
    });
  }

  static load () {
    return new Promise((resolve, reject) => {
      fs.readFile('./schedule.json', 'utf8', (error, data) => {
        if (error) reject(error);
        data ? resolve(new Schedule(JSON.parse(data))) : resolve(new Schedule());
      });
    });
  }
}
