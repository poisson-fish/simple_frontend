/**
 * Input prompt example
 */

import inquirer from '../lib/inquirer.js'

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
    name: 'fav_color',
    message: "What's your favorite color"
  },
  {
    type: 'input',
    name: 'phone',
    message: "What's your phone number",
    validate (value) {
      const pass = value.match(
        /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
      )
      if (pass) {
        return true
      }

      return 'Please enter a valid phone number'
    }
  }
]

inquirer.prompt(questions).then((answers) => {
  console.log(JSON.stringify(answers, null, '  '))
})
