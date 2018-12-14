var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var table = new Table({
    head: ["Product ID", "Product Name", "Department Name", "Price", "Stock Quantity"],
    colWidths: [15, 80, 40, 25, 20]
});
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});
var productList
function display() {
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        productList = [];
        results.forEach(function (element) {
            if (element.stock_quantity > 0) {
                productList.push({
                    name: (element.item_id + " | " + element.product_name),
                    value: (element.item_id)
                });
            }
            table.push([element.item_id, element.product_name, element.department_name, "$" + element.price, element.stock_quantity]);
        })
        console.log(table.toString());
        main();
    })
}
function main() {
    inquirer.prompt([
        {
            name: "id",
            message: "Which product would you like to buy?",
            choices: productList,
            type: "list",
            pageSize: productList.length
        },
        {
            name: "num",
            message: "How many would you like to buy?",
            type: "input",
            filter: function (input) {
                return parseInt(input);
            }
        }
    ])
        .then(function (answers) {
            if (!(answers.num > 0)) {
                console.log("Please enter a valid number.");
                main;
            }
            else if (answers.num > table[answers.id - 1][4]) {
                console.log("Insufficient quantity!");
                main;
            }
            else {
                console.log("Total cost: $" + answers.num * parseFloat(table[answers.id - 1][3].slice(1)));
                connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [answers.num, answers.id], function (error, results, fields) {
                    if (error) throw error;
                })
                connection.end();
            }
        })
}

display();
