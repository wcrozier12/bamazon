const inquirer = require('inquirer');
const mysql = require('mysql');
require('console.table');

const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Horizon45!",
  database: "bamazon"
});

//Prompt menu
function supervisorMenu() {
  inquirer
  .prompt([
    {
      type: 'list',
      message:'What would you like to do?',
      choices: ['View Product Sales By Department', 'Create New Department', 'Exit'],
      name: 'userChoice',
    },
  ]).then(function(response) {
    switch (response.userChoice) {
      case 'View Product Sales By Department':
        viewSales();
        break;
      case 'Create New Department':
        promptForNewDepartment();
        break;
      case 'Exit':
        console.log('GoodBye');
        connection.end();
    } 
  })
}
//Queries database to provide an on the fly table called departProd that displays the departments, overhead costs, product sales, and total profit.
function viewSales() {
  connection.query("SELECT departProd.department_id, departProd.department_name, departProd.over_head_costs, SUM(departProd.product_sales) as product_sales, (SUM(departProd.product_sales) - departProd.over_head_costs) as total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.product_sales, 0) as product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as departProd GROUP BY department_id", function(err, res) {
    console.table(res);
    supervisorMenu();
  })
}

//Prompts user to create new department
function promptForNewDepartment() {
    inquirer
  .prompt([
    {
      type: 'input',
      message: 'What is the name of the department?\n',
      name: 'department',
    },
    {
      type: 'input',
      message: 'What is the overhead cost of the department?',
      name: 'overhead',
    }
  ]).then(function(response) {
    addDepartment(response.department, parseInt(response.overhead));
  })
}

//Uses user prompt data to add a new department to the database.
function addDepartment(department, overhead) {
    let query = 'INSERT INTO departments(department_name, over_head_costs) VALUES (?, ?)';
    connection.query(query, [department, overhead], function(err,res) {
      if (err) throw err;
      console.log('New department added: ' + department + ', with an overhead cost of: $' + overhead);
      supervisorMenu();
    })
}
supervisorMenu();