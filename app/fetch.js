'use strict';

import * as http from 'http';

export default function fetch(bandName) {
  return new Promise((resolve, reject) => {
    let responseBody = '';
    http.get({
      host: 'api.bandsintown.com',
      path: `/artists/${bandName.replace(/\s/g, '%20')}/events.json?app_id=beatleboy`
    }, res => {
      res.on('data', data => responseBody += data);
      res.on('end', () => {resolve(JSON.parse(responseBody));
    });
      res.on('error', error => reject(error));
    });
});}
