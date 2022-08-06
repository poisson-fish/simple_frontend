/**
 * Input prompt example
 */

import inquirer from 'inquirer'

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
    name: 'size',
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
  console.log(JSON.stringify(answers, null, '  '))
})
