const inquirer = require('inquirer');
const mysql = require('mysql');
require('console.table');
const key = require('./keys.js')

const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: key.password,
  database: "bamazon"
});

//Menu prompts
function customerMenu() {
  inquirer
  .prompt([
    {
      type: 'list',
      message:'What would you like to do?',
      choices: ['View Products', 'Buy Product', 'Exit'],
      name: 'userChoice',
    },
  ]).then(function(response) {
    switch (response.userChoice) {
      case 'View Products':
        displayProducts();
        break;
      case 'Buy Product':
        purchaseMenu();
        break;
      case 'Exit':
        console.log('Goodbye. Thank you for shopping!')
        connection.end();
    } 
  })
}

//Queries DB, loops through products and prints id, name, and price to the console.
function displayProducts() {
  let query = 'SELECT * FROM products';
  connection.query(query, function(err, res) {
    for (let i = 0; i < res.length; i ++) {
      console.log(res[i].item_id + ') ' + res[i].product_name + ' $' + res[i].price);
    }
    customerMenu();
  }) 
}

//Checks current stock of item to make sure there is enough inventory to complete order. If there is enough inventory, runs 'fulfillOrder'
function checkStock(item, orderQuantity) {
    let query = 'SELECT * FROM products WHERE ?';
    connection.query(query, {'item_id': item}, function(err, res1) {
      let currentStock = res1[0].stock_quantity;
      let itemPrice = res1[0].price;
      let currentSales = res1[0].product_sales;
      if (err) throw err;
      if (orderQuantity > currentStock) {
        console.log('There are only ' + currentStock + ' ' + res1[0].product_name + ' in stock. Please change your order quantity.');
        customerMenu();
        return;
      }
      fulfillOrder(item, orderQuantity, itemPrice, currentSales, currentStock);
      console.log('Order placed!');
      console.log('Your total: $' + (itemPrice * orderQuantity));
      customerMenu();
    })
}

//Using the input from user prompts updates stock quantity and product sales to reflect order 
function fulfillOrder(item, orderQuantity, itemPrice, currentSales, currentStock) {
  let query2 = 'UPDATE products SET ? WHERE ?';
    connection.query(query2, 
    [
      {
        stock_quantity: currentStock - orderQuantity,
        product_sales: currentSales + (itemPrice * orderQuantity)
      },
      {
        item_id: item
      },
    ], function (err,res) {
      if (err) throw err;
    })
}

//Prompts user to buy, checks inventory, then fulfills order.
function purchaseMenu() {
  inquirer
  .prompt([
    {
      type: 'input',
      message: 'What is the ID of the item you would like to buy?',
      name: 'item',
    },
    {
      type: 'input',
      message: 'How many would you like to buy?',
      name: 'quantity',
    }
  ]).then(function(response) {
    checkStock(parseInt(response.item), parseInt(response.quantity));
  })
}
//Runs customer menu
customerMenu();