import inquirer from 'inquirer'
// get the client
import mysql from 'mysql2'
// eslint-disable-next-line no-unused-vars
import cTable from 'console.table'

const mainMenu = [
  {
    type: 'list',
    name: 'main_menu',
    message: 'Choose selection...',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add department', 'Add role', 'Add employee', 'Update employee', 'Done'],
    filter (val) {
      return val.split(' ').join('_').toUpperCase()
    }
  }
]
const addDepartment = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter a department name'
  }
]
const addRole = [
  {
    type: 'input',
    name: 'title',
    message: 'Enter a role title'
  },
  {
    type: 'input',
    name: 'salary',
    message: 'Enter a role salary'
  },
  {
    type: 'input',
    name: 'dept_id',
    message: 'Enter a department ID for this role'
  }
]
const addEmployee = [
  {
    type: 'input',
    name: 'first_name',
    message: 'Enter a first name for employee'
  },
  {
    type: 'input',
    name: 'last_name',
    message: 'Enter a last name for employee'
  },
  {
    type: 'input',
    name: 'role_id',
    message: 'Enter a role ID for this employee'
  },
  {
    type: 'input',
    name: 'manager_id',
    message: 'Enter a manager ID for this employee'
  }
]
const updateEmployee = [
  {
    type: 'input',
    name: 'id',
    message: 'Enter an employee ID to update'
  },
  {
    type: 'input',
    name: 'role_id',
    message: 'Enter a new role for this employee'
  }
]

async function promptMainMenu (connection, fullTeam) {
  let askAgain = true
  await inquirer.prompt(mainMenu).then(async (mainMenuAnswer) => {
    switch (mainMenuAnswer.main_menu) {
      case 'VIEW_ALL_DEPARTMENTS':
        // simple query
        connection.query(
          'SELECT * FROM `DEPARTMENTS`',
          function (_err, results, fields) {
            console.table(results)
          }
        )
        break

      case 'VIEW_ALL_ROLES':
        // simple query
        connection.query(
          'SELECT * FROM `ROLES`',
          function (_err, results, fields) {
            console.table(results)
          }
        )
        break

      case 'VIEW_ALL_EMPLOYEES':
        // simple query
        connection.query(
          'SELECT * FROM `EMPLOYEES`',
          function (_err, results, fields) {
            console.table(results)
          }
        )
        break

      case 'ADD_DEPARTMENT':

        await inquirer.prompt(addDepartment).then(async (deptAnswers) => {
          connection.execute(
            'INSERT INTO `DEPARTMENTS` (`name`) VALUES (?)',
            [deptAnswers.name],
            function (_err, results, fields) {
              // console.log(results) // results contains rows returned by server
              // console.log(fields) // fields contains extra meta data about results, if available
            }
          )
        })
        break

      case 'ADD_ROLE':
        await inquirer.prompt(addRole).then(async (roleAnswers) => {
          connection.execute(
            'INSERT INTO `ROLES` (`title`,`salary`,`department_id`) VALUES (?, ?, ?)',
            [roleAnswers.title, parseInt(roleAnswers.salary), parseInt(roleAnswers.dept_id)],
            function (_err, results, fields) {
              console.log(results) // results contains rows returned by server
              console.log(fields) // fields contains extra meta data about results, if available
            }
          )
        })
        break

      case 'ADD_EMPLOYEE':
        await inquirer.prompt(addEmployee).then(async (employeeAnswers) => {
          connection.execute(
            'INSERT INTO `EMPLOYEES` (`first_name`, `last_name`, `role_id`, `manager_id`) VALUES (?, ?, ?, ?)',
            [employeeAnswers.first_name, employeeAnswers.last_name, parseInt(employeeAnswers.role_id), parseInt(employeeAnswers.manager_id)],
            function (_err, results, fields) {
              console.log(results) // results contains rows returned by server
              console.log(fields) // fields contains extra meta data about results, if available
            }
          )
        })
        break
      case 'UPDATE_EMPLOYEE':
        connection.query(
          'SELECT * FROM `EMPLOYEES`',
          function (_err, results, fields) {
            console.table(results)
          }
        )
        await inquirer.prompt(updateEmployee).then(async (employeeAnswers) => {
          connection.execute(
            'UPDATE `EMPLOYEES` SET `role_id` = ? WHERE id = ?',
            [parseInt(employeeAnswers.role_id), parseInt(employeeAnswers.id)],
            function (_err, results, fields) {
              console.log(results) // results contains rows returned by server
              // console.log(fields) // fields contains extra meta data about results, if available
            }
          )
        })
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

function runMigration (connection) {
  connection.query(
    `CREATE TABLE IF NOT EXISTS DEPARTMENTS (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
    function (_err, results, fields) {
      // console.log(results) // results contains rows returned by server
      // console.log(fields) // fields contains extra meta data about results, if available
    }
  )
  connection.query(
    `CREATE TABLE IF NOT EXISTS ROLES (
      id INT AUTO_INCREMENT PRIMARY KEY,
      department_id INT,
      title VARCHAR(30) NOT NULL,
      salary DECIMAL NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id)
        REFERENCES DEPARTMENTS (id)
        ON UPDATE RESTRICT ON DELETE CASCADE
      
  )`,
    function (_err, results, fields) {
      // console.log(results) // results contains rows returned by server
      // console.log(fields) // fields contains extra meta data about results, if available
    }
  )
  connection.query(
    `CREATE TABLE IF NOT EXISTS EMPLOYEES (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role_id INT,
      manager_id INT,
      first_name VARCHAR(30) NOT NULL,
      last_name VARCHAR(30) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id)
        REFERENCES ROLES (id)
        ON UPDATE RESTRICT ON DELETE CASCADE,
      FOREIGN KEY (manager_id)
        REFERENCES EMPLOYEES (id)
        ON UPDATE RESTRICT ON DELETE CASCADE
  )`,
    function (_err, results, fields) {
      // console.log(results) // results contains rows returned by server
      // console.log(fields) // fields contains extra meta data about results, if available
    }
  )
}

function run () {
  const fullTeam = []

  // create the connection to database
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    database: 'db',
    password: 'password'
  })
  runMigration(connection)
  promptMainMenu(connection, fullTeam)
}
run()
