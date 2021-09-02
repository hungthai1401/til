#!/usr/bin/env node
const figlet = require('figlet');
const chalk = require('chalk');
const prompts = require('prompts');
const entry = require('./entry');

console.log(
  chalk.cyan(
    figlet.textSync('Today I Learned', { horizontalLayout: 'full' })
  )
);
(async () => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Choose the action',
    choices: [
      { title: 'Create new entry', value: 'new' },
      { title: 'Compile the summary', value: 'compile' },
    ],
  });
  entry[action]();
})();
