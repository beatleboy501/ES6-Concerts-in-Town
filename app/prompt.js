'use strict';

import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export default function prompt (ques) {
  return new Promise((resolve, reject) => {
    rl.question(ques, answer => {
      answer ? resolve(answer) : reject('No command given');
    });
  });
}

export function promptForEvent (event, ques) {
  return new Promise((resolve, reject) => {
    rl.question(ques, answer => answer ?
      resolve({ answer: answer, event: event }) : reject('No command given'));
  });
}
