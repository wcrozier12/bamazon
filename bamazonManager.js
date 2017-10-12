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

//Main prompt menu
function managerMenu() {
  inquirer
  .prompt([
    {
      type: 'list',
      message:'What would you like to do?',
      choices: ['View Products', 'View Low Inventory', 'Add to Inventory', 'Add new product', 'Exit'],
      name: 'userChoice',
    },
  ]).then(function(response) {
    switch (response.userChoice) {
      case 'View Products':
        viewProducts();
        break;
      case 'View Low Inventory':
        lowInventory();
        break;
      case 'Add to Inventory':
        promptToAddInventory();
        break;
      case 'Add new product':
        promptToAddProduct();
        break;
      case 'Exit':
        console.log('GoodBye');
        connection.end();
    } 
  })
}
//Displays all products, if the item has no sales, replaces null with zero.
function viewProducts() {
  let query = 'SELECT item_id, product_name, department_name, price, stock_quantity, IFNULL(products.product_sales, 0) as product_sales FROM products';
  connection.query(query, function(err, res) {
    console.table(res);
    managerMenu();
  })
}

//Displays all items that have a stock below 5. If all items have a stock > 5, lets the user know.
function lowInventory() {
  let query = 'SELECT * FROM products WHERE stock_quantity < 5';
  connection.query(query, function(err, res) {
    if (err) throw err;
    if (res.length === 0) {
      console.log('All items have a stock greater than 5.')
      managerMenu();
      return;
    }
    for (let i = 0; i < res.length; i ++) {
      console.log(res[i].item_id + ') ' + res[i].product_name + ' $' + res[i].price + ' Current Stock: ' + res[i].stock_quantity);
    }
    managerMenu();
  })
}

//Prompts to add inventory to an item
function promptToAddInventory() {
  inquirer
  .prompt([
    {
      type: 'input',
      message: 'What is the ID of the item you want to add inventory to?\n',
      name: 'item',
    },
    {
      type: 'input',
      message: 'How many items would you like to add?',
      name: 'quantity',
    }
  ]).then(function(response) {
    selectItemToAddInventory(parseInt(response.item), parseInt(response.quantity));
  })
}

//Selects the item and quantity that the user chose in the 'promptToAddInventory' function, and then runs 'updateInventory' function
function selectItemToAddInventory(item, orderQuantity) {
  let query = 'SELECT * FROM PRODUCTS WHERE ?';
  connection.query(query, {'item_id': item}, function(err, res1) {
    let currentStock = res1[0].stock_quantity;
    if (err) throw err;
    updateInventory(item, orderQuantity, currentStock);
    console.log('Inventory updated!');
    managerMenu();
  })
}
//Updates the stock_quantity of the item that the user chose via prompt
function updateInventory(item, orderQuantity, currentStock) {
  let query2 = 'UPDATE products SET ? WHERE ?';
    connection.query(query2, 
    [
      {
        stock_quantity: currentStock + orderQuantity
      },
      {
        item_id: item
      },
    ], function (err,res) {
      if (err) throw err;
    })
}

//Prompts the user to add a product
function promptToAddProduct() {
  inquirer
  .prompt([
    {
      type: 'input',
      message: 'What is the name of the product?\n',
      name: 'productName',
    },
    {
      type: 'input',
      message: 'What department is the product in?',
      name: 'department',
    },
    {
      type: 'input',
      message: 'What is the price of the product?',
      name: 'price',
    },
    {
      type: 'input',
      message: 'What is the stock quantity?',
      name: 'quantity',
    }
  ]).then(function(response) {
    addProduct(response.productName, response.department, parseInt(response.price), parseInt(response.quantity));
  })
}

//Inserts the product into the database with the parameters the user chose via prompt
function addProduct(productName, department, price, quantity) {
  let query = 'INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)';
  connection.query(query, [productName, department, price, quantity], function(err, res) {
    if (err) throw err;
    console.log('Product added!');
    managerMenu();
  })
}

//runs the menu 
managerMenu();
