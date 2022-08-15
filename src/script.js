import fs from 'fs'
import inquirer from 'inquirer'
import Manager from './Manager.cjs'
import Engineer from './Engineer.cjs'
import Intern from './Intern.cjs'
import body from './generators/body.cjs'

const teamManagerQuestions = [
  {
    type: 'input',
    name: 'manager_name',
    message: 'Enter a team manager name'
  },
  {
    type: 'input',
    name: 'manager_id',
    message: 'Enter a team manager ID'
  },
  {
    type: 'input',
    name: 'manager_email',
    message: 'Enter a team manager email'
  },
  {
    type: 'input',
    name: 'manager_officeNumber',
    message: 'Enter a team manager office number'
  }
]
const engineerQuestions = [
  {
    type: 'input',
    name: 'engineer_name',
    message: 'Enter an engineer name'
  },
  {
    type: 'input',
    name: 'engineer_id',
    message: 'Enter an engineer ID'
  },
  {
    type: 'input',
    name: 'engineer_email',
    message: 'Enter an engineer email'
  },
  {
    type: 'input',
    name: 'engineer_github',
    message: 'Enter a GitHub username for engineer'
  }
]
const internQuestions = [
  {
    type: 'input',
    name: 'intern_name',
    message: 'Enter an intern name'
  },
  {
    type: 'input',
    name: 'intern_id',
    message: 'Enter an intern ID'
  },
  {
    type: 'input',
    name: 'intern_email',
    message: 'Enter an intern email'
  },
  {
    type: 'input',
    name: 'intern_school',
    message: 'Enter a school for intern'
  }
]

const employeeTypeQuestion = [
  {
    type: 'list',
    name: 'employee_type',
    message: 'Choose what type of employee to add',
    choices: ['Engineer', 'Intern', 'Done'],
    filter (val) {
      return val.toUpperCase()
    }
  }
]

function buildUX (fullTeam) {
  const teamHtml = fullTeam.map((member) => `${member.renderToHtml()}`).join('')
  const wholePage = body(teamHtml)

  fs.writeFile('./dist/index.html', wholePage, err => {
    if (err) {
      console.error(err)
    }
    console.log('Succesfully wrote dist/index.html')
  })
  console.log(wholePage)
}

async function promptTeamMembers (fullTeam) {
  let askAgain = true
  await inquirer.prompt(employeeTypeQuestion).then(async (employeeTypeAnswer) => {
    switch (employeeTypeAnswer.employee_type) {
      case 'ENGINEER':
        await inquirer.prompt(engineerQuestions).then((engineerAnswers) => {
          fullTeam.push(new Engineer(engineerAnswers.engineer_id, engineerAnswers.engineer_name, engineerAnswers.engineer_email, engineerAnswers.engineer_github))
        })
        break

      case 'INTERN':
        await inquirer.prompt(internQuestions).then((internAnswers) => {
          fullTeam.push(new Intern(internAnswers.intern_id, internAnswers.intern_name, internAnswers.intern_email, internAnswers.intern_school))
        })
        break

      case 'DONE':
        askAgain = false
        break
    }
  })
  if (askAgain) {
    await promptTeamMembers(fullTeam)
  }
}
function run () {
  const fullTeam = []
  inquirer.prompt(teamManagerQuestions).then(async (teamManagerAnswer) => {
    fullTeam.push(new Manager(teamManagerAnswer.manager_id, teamManagerAnswer.manager_name, teamManagerAnswer.manager_email, teamManagerAnswer.manager_officeNumber))
    await promptTeamMembers(fullTeam)
  }).then(() => buildUX(fullTeam))
}
run()
