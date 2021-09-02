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

const newEntryContent = ({ date, title }) => {
  return `
---
title: ${title}
date: ${date}
---
`
};

const createNewEntryFile = ({ date, title }) => {
  const fileName = `${date.replaceAll('-', '_')}_${title.trim().toLowerCase().replaceAll(/\s+/g, '_').replace('+', 'plus')}.md`;
  fs.writeFile(`${ENTRIES_DIR}/${fileName}`, newEntryContent({ date, title }), 'utf8', _ => {});
  console.log(chalk.black.bgCyan('New entry file has been created!!!'));
}

const summary = (entries) => {
  const content = `
# Today I learned
Total : ${entries.length} TILs
## All Entries
${entries.map(({ date, title, path }) => `- [${title}](./${ENTRIES_DIR}/${path}) - ${date}`).join("\r\n")}
## CLI Usage
- \`yarn install\`
- \`yarn link\`
- \`til\`
- \`til --action="new"\` Create new entry
- \`til --action="compile"\` Compile summary & rebuild README
## Screenshot:
![CLI](./screenshots/cli.png)
`;
  fs.writeFile('README.md', content, 'utf8', _ => {});
  console.log(chalk.black.bgCyan('New summary file has been compile!!!'));
}

module.exports = {
  new: () => {
    const questions = [
      {
        type: 'text',
        name: 'title',
        message: 'Title:',
        validate: value => ! value ? 'Title required' : true,
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
      const response = await prompts(questions);
      createEntriesDirectory();
      createNewEntryFile(response);
    })();
  },

  compile: () => {
    let entries = [];
    const files = fs.readdirSync(ENTRIES_DIR);
    files.forEach(path => {
      const content = fs.readFileSync(`${ENTRIES_DIR}/${path}`, 'utf8');
      const { attributes: { title, date } } = fm(content);
      entries = [ ...entries, { date: format(date, 'yyyy-MM-dd'), title, path } ];
    });
    summary(entries);
  }
}
