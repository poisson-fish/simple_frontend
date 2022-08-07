/**
 * Input prompt example
 */

import fs from 'fs'
import inquirer from 'inquirer'
import { licenseTable } from './license.js'


const questions = [
  {
    type: 'input',
    name: 'project_title',
    message: 'Enter a name for your project'
  },
  {
    type: 'input',
    name: 'project_description',
    message: 'Enter a description for your project',
    default () {
      return '<no description>'
    }
  },
  {
    type: 'input',
    name: 'installation_instructions',
    message: 'Enter some instructions for installing'
  },
  {
    type: 'input',
    name: 'usage_information',
    message: 'Enter some usage information'
  },
  {
    type: 'input',
    name: 'contrib_guidelines',
    message: 'Enter some contribution guidelines'
  },
  {
    type: 'input',
    name: 'test_instructions',
    message: 'Enter some test instructions'
  },
  {
    type: 'list',
    name: 'license',
    message: 'What license do you want?',
    choices: ['LGPL', 'GPL', 'MIT', 'Apache', 'BSD', 'CC-BY'],
    filter (val) {
      return val.toUpperCase()
    }
  },
  {
    type: 'input',
    name: 'username',
    message: 'Enter your GitHub Username'
  },
  {
    type: 'input',
    name: 'email',
    message: 'Enter your contact email'
  }
]

inquirer.prompt(questions).then((answers) => {

  const readMe = 
`# ${answers.project_title}
## Description
###### ${answers.project_description}

## Table of Contents
 - [Title](https://github.com/${answers.username}/${answers.project_title}#${answers.project_title})
 - [Description](https://github.com/${answers.username}/${answers.project_title}#description)
 - [Table of Contents](https://github.com/${answers.username}/${answers.project_title}#table-of-contents)
 - [Installation](https://github.com/${answers.username}/${answers.project_title}#installation)
 - [Usage](https://github.com/${answers.username}/${answers.project_title}#usage)
 - [Tests](https://github.com/${answers.username}/${answers.project_title}#tests)
 - [License](https://github.com/${answers.username}/${answers.project_title}#license)

## Installation
${answers.installation_instructions}

## Usage
${answers.usage_information}

## Contributing
${answers.contrib_guidelines}

## Tests
${answers.test_instructions}

## License
[${answers.license}](https://github.com/${answers.username}/${answers.project_title}/LICENSE.md)
  
`

fs.writeFile('README.md', readMe, err => {
  if (err) {
    console.error(err);
  }
  console.log("Succesfully wrote README.md")
});
fs.writeFile('LICENSE.md', licenseTable.get(answers.license), err => {
  if (err) {
    console.error(err);
  }
  console.log("Succesfully wrote LICENSE.md")
});
  //console.log(JSON.stringify(answers, null, '  '))
})
