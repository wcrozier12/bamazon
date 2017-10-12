DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;
CREATE TABLE products(
item_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT(10) NOT NULL,
product_sales DECIMAL(10,2) NULL
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('Shoes', 'Clothing', 40, 100), ('iPhone', 'Electronics', 699, 50), ('Headphones', 'Electronics', 60, 200), ('Tent', 'Sporting Goods', 400, 150), ('Sleeping Bag', 'Sporting Goods', 300, 100), ('Hat', 'Clothing', 20, 250), ('Blender', 'Appliances', 50, 75), ('Laptop', 'Electronics', 1000, 45), ('Bike', 'Sporting Goods', 450, 30), ('Electric Kettle', 'Appliances', 35, 100); 

CREATE TABLE departments(
  department_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs INT(10) NOT NULL
);

INSERT INTO departments(department_name, over_head_costs)
VALUES ('Clothing', 10000), ('Electronics', 25000), ('Sporting Goods', 15000), ('Appliances', 12000);


