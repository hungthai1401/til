const prompts = require('prompts');
const fs = require('fs');
var format = require('date-fns/format');
const isValid = require('date-fns/isValid');
const parseISO = require('date-fns/parseISO');

const ENTRIES_DIR = 'entries';

const isValidDateFormat = value => value.match(/^\d{4}(-)\d{1,2}\1\d{1,2}$/g);

const createEntriesDirectory = () => fs.mkdir(ENTRIES_DIR, { recursive: true }, _ => {});

const createNewEntryFile = ({ date, title }) => {
  const fileName = `${date.replaceAll('-', '_')}_${title.trim().toLowerCase().replaceAll(/\s+/g, '_')}.md`;
  fs.writeFile(`${ENTRIES_DIR}/${fileName}`, '', 'utf8', _ => {});
}

const titleCase = str => str.charAt(0).toUpperCase() + str.slice(1);

const summary = (entries) => {
  const content = `
# Today I learned
Total : ${entries.length} TILs
## All Entries
${entries.map(({ date, fileName, path }) => `- [${fileName}](./${ENTRIES_DIR}/${path}) - ${date}`).join("\r\n")}
## CLI Usage
- \`yarn install\`
- \`chmod +x ./index.js\`
- \`./index.js new\` Create new entry
- \`./index.js compile\` Compile summary & rebuild README
`;
  fs.writeFile('README.md', content, 'utf8', _ => {});
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
    fs.readdir(ENTRIES_DIR, (_, files) => {
      let entries = [];
      files.forEach(path => {
        const [, date, fileName] = path.match(/(^\d{4}_\d{1,2}_\d{1,2})_(\w*)[.md$]/);
        entries = [ ...entries, { date: date.replaceAll('_', '-'), fileName: titleCase(fileName.replaceAll('_', ' ')), path } ];
      });
      summary(entries);
    });
  }
}
