const prompts = require('prompts');
const fs = require('fs');
const format = require('date-fns/format');
const isValid = require('date-fns/isValid');
const parseISO = require('date-fns/parseISO');
const chalk = require('chalk');
const fm = require('front-matter');

const ENTRIES_DIR = 'entries';

const isValidDateFormat = value => value.match(/^\d{4}(-)\d{1,2}\1\d{1,2}$/g);

const createEntriesDirectory = () => fs.mkdir(ENTRIES_DIR, { recursive: true }, _ => {});

const createCategoryDirectory = (category) => fs.mkdir(`${ENTRIES_DIR}/${category}`, { recursive: true }, _ => {});

const newEntryContent = ({ date, title }) => {
  return `---
title: ${title}
date: ${date}
---
`
};

const createNewEntryFile = ({ category, date, title }) => {
  const fileName = `${date.replaceAll('-', '_')}_${title.trim().toLowerCase().replaceAll(/\s+/g, '_').replace('+', 'plus')}.md`;
  fs.writeFile(`${ENTRIES_DIR}/${category}/${fileName}`, newEntryContent({ date, title }), 'utf8', _ => {});
  console.log(chalk.black.bgCyan('New entry file has been created!!!'));
}

const summary = (entries) => {
  const content = `![CLI](./screenshots/cli.png)

_Things I've learned and/or things I want to remember. Notes, links, advice, example code, etc._

This is inspired by https://github.com/narze/til

## All Entries
${Object.keys(entries).map(category => `\r\n### ${category}\r\n\r\n${entries[category].map(({ date, title, path }) => `- [${title}](./${ENTRIES_DIR}/${path}) - ${date}`).join("\r\n")}`).join("\r\n")}

## CLI Usage

- \`yarn install\`
- \`yarn link\`
- \`til\`
- \`til --action="new"\` Create new entry
- \`til --action="compile"\` Compile summary & rebuild README
`;
  fs.writeFile('README.md', content, 'utf8', _ => {});
  console.log(chalk.black.bgCyan('New summary file has been compile!!!'));
}

module.exports = {
  new: () => {
    const categories = fs
      .readdirSync(ENTRIES_DIR, { withFileTypes: true })
      .filter(dir => dir.isDirectory())
      .map(({ name }) => ({ title: name, value: name }))
    const questions = [
      {
        type: 'text',
        name: 'title',
        message: 'Title:',
        validate: value => ! value ? 'Title required' : true,
      },
      {
        type: 'autocomplete',
        name: 'category',
        message: 'Category',
        choices: categories,
        suggest: (input, choices) => input.length === 0 ? Promise.resolve(choices) : Promise.resolve(choices.filter(i => i.title.toLowerCase() === input.toLowerCase())),
        onState: function() {
          this.fallback = { title: this.input, value: this.input };
          // Check to make sure there are no suggestions so we do not override a suggestion
          if (this.suggestions.length === 0) {
            this.value = this.input;
          }
        },
      },
      {
        type: 'text',
        name: 'date',
        message: 'Date:',
        initial: format(new Date(), 'yyyy-MM-dd'),
        validate: value => ! (isValidDateFormat(value) && isValid(parseISO(value))) ? 'Date wrong' : true,
      },
    ];
    (async () => {
      const { title, category, date } = await prompts(questions);
      if (! (title && category && date)) {
        console.log(chalk.black.bgRed('Failed to create new entry. Please try again!!!'));
        return;
      }
      createEntriesDirectory();
      createCategoryDirectory(category);
      createNewEntryFile({ category, title, date });
    })();
  },

  compile: () => {
    let entries = {};
    const categories = fs.readdirSync(ENTRIES_DIR);
    categories.forEach(category => {
      if (! entries.hasOwnProperty(category)) {
        entries[category] = [];
      }
      const files = fs.readdirSync(`${ENTRIES_DIR}/${category}`);
      files.forEach(path => {
        const content = fs.readFileSync(`${ENTRIES_DIR}/${category}/${path}`, 'utf8');
        const { attributes: { title, date } } = fm(content);
        entries[category] = [ ...entries[category], { category, date: format(date, 'yyyy-MM-dd'), title, path } ];
      });
    });
    summary(entries);
  }
}
