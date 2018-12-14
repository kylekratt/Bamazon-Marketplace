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
var departments = [];
connection.query('SELECT department_name FROM products GROUP BY department_name', function (error, results, fields) {
    if (error) throw error;
    results.forEach(function (element) {
        departments.push(element.department_name);
    })
    connection.query('SELECT * FROM products', function (error, results, fields) {
        productList = [];
        results.forEach(function (element) {
            productList.push({
                name: (element.item_id + " | " + element.product_name),
                value: (element.item_id)
            });
        })
        main();
    })
})
function display() {
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        results.forEach(function (element) {
            table.push([element.item_id, element.product_name, element.department_name, "$" + element.price, element.stock_quantity]);
        })
        console.log(table.toString());
    })
}
function displayLow() {
    connection.query('SELECT * FROM products WHERE stock_quantity<5', function (error, results, fields) {
        if (error) throw error;
        results.forEach(function (element) {
            console.log(element.item_id + " | " + element.product_name + " | " + element.stock_quantity)
        })
    })
}
function main() {
    inquirer.prompt([
        {
            name: "choice",
            message: "What would you like to do?",
            choices: [{
                name: "View Products for Sale",
                value: 0
            }, {
                name: "View Low Inventory",
                value: 1
            }, {
                name: "Add to Inventory",
                value: 2
            }, {
                name: "Add New Product",
                value: 3
            }, {
                name: "Quit",
                value: 4
            }],
            type: "list",
        },
        {
            name: "addInv",
            message: "What product would you like to add to?",
            type: "list",
            choices: productList,
            when: function (answers) {
                if (answers.choice == 2) return true;
                else return false;
            }
        },
        {
            name: "addProd",
            message: "What product would you like to add?",
            type: "input",
            when: function (answers) {
                if (answers.choice == 3) return true;
                else return false;
            }
        },
        {
            name: "dep",
            message: "What department does the new product belong to?",
            type: "input",
            when: function (answers) {
                if (answers.choice == 3) return true;
                else return false;
            }
        },
        {
            name: "price",
            message: "What is the price of the new product?",
            type: "input",
            when: function (answers) {
                if (answers.choice == 3) return true;
                else return false;
            }
        },
        {
            name: "num",
            message: "How many would you like to add?",
            type: "input",
            when: function (answers) {
                if ((answers.choice == 2) || (answers.choice == 3)) return true;
                else return false;
            }
        }
    ])
        .then(function (answers) {
            if (answers.choice == 0) {
                display();
                main();
            }
            else if (answers.choice == 1) {
                displayLow();
                main();
            }
            else if (answers.choice == 2) {
                connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?', [answers.num, answers.id], function (error, results, fields) {
                    if (error) throw error;
                })
                main();
            }
            else if (answers.choice == 3) {
                connect.query('INSERT INTO products SET (product_name, department_name, price, stock_quantity) = ?' [answers.addProd, answers.dep, answers.price, answers.num], function (error, results, fields) {
                    if (error) throw error;
                })
                main();
            }
            else if (answers.choice ==4) {
                connection.end();
            }
        })
}
