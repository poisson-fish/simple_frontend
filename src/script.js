import fs from 'fs'
import inquirer from 'inquirer'
// get the client
import mysql from 'mysql2'

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

async function promptMainMenu (connection, fullTeam) {
  let askAgain = true
  await inquirer.prompt(mainMenu).then(async (mainMenuAnswer) => {
    switch (mainMenuAnswer.main_menu) {
      case 'VIEW_ALL_DEPARTMENTS':
        // simple query
        connection.query(
          'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45',
          function (_err, results, fields) {
            console.log(results) // results contains rows returned by server
            console.log(fields) // fields contains extra meta data about results, if available
          }
        )
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
    await promptMainMenu(connection, fullTeam)
  }
}
function run () {
  const fullTeam = []

  // create the connection to database
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'test'
  })

  promptMainMenu(connection, fullTeam)
}
run()
