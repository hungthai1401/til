const prompts = require('prompts');
const fs = require('fs');
const { isAfter, format } = require('date-fns');
const chalk = require('chalk');
const fm = require('front-matter');

const ENTRIES_DIR = 'entries';

const createEntriesDirectory = () => fs.mkdir(ENTRIES_DIR, { recursive: true }, _ => {});

const createCategoryDirectory = (category) => fs.mkdir(`${ENTRIES_DIR}/${category}`, { recursive: true }, _ => {});

const newEntryContent = ({ category, date, title }) => {
  return `---
title: ${title}
category: ${category}
date: ${date}
---
`
};

const createNewEntryFile = ({ category, date, title }) => {
  const fileName = `${date}_${title.trim().toLowerCase().replaceAll(/\s+/g, '_')}.md`;
  fs.writeFile(`${ENTRIES_DIR}/${category}/${fileName}`, newEntryContent({ category, date, title }), 'utf8', _ => {});
  console.log(chalk.black.bgCyan('New entry file has been created!!!'));
}

const summary = (entries) => {
  const content = `![CLI](./screenshots/cli.png)

This is inspired by https://github.com/narze/til

## All Entries
${Object.keys(entries).map(category => `\r\n### ${category}\r\n\r\n${entries[category].map(({ date, title, path }) => `- [${title}](./${ENTRIES_DIR}/${category}/${path}) - ${date}`).join("\r\n")}`).join("\r\n")}

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
      .map(({ name }) => ({ title: name, value: name }));
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
        type: 'date',
        name: 'date',
        message: 'Date:',
        initial: new Date(),
        mask: 'YYYY-MM-DD',
        validate: date => isAfter(date, Date.now()) ? 'Date not in the future' : true,
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
      createNewEntryFile({ category, title, date: format(date, 'yyyy_MM_dd') });
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
