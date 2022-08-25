import fs from 'fs'
import inquirer from 'inquirer'
import Manager from './Manager.cjs'
import Engineer from './Engineer.cjs'
import Intern from './Intern.cjs'
import body from './generators/body.cjs'

const mainMenu = [
  {
    type: 'list',
    name: 'main_menu',
    message: 'Choose selection...',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add department', 'Add role', 'Add employee', 'Update role'],
    filter (val) {
      return val.split(' ').join('_').toUpperCase()
    }
  }
]
const engineerQuestions = [
  {
    type: 'input',
    name: 'engineer_name',
    message: 'Enter an engineer name'
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
  await inquirer.prompt(mainMenu).then(async (mainMenuAnswer) => {
    switch (mainMenuAnswer.main_menu) {
      case 'VIEW_ALL_DEPARTMENTS':

        break

      case 'VIEW_ALL_ROLES':

        break

      case 'VIEW_ALL_EMPLOYEES':

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
