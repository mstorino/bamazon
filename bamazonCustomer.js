var mysql = require ("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});


//connection object to make connection happen
connection.connect(function(err){
    if(err) {
        console.log(err);
    } 
   
    // if no error display products & properties

   productList();
});

//function that displays products

var productList = function () {

    connection.query("SELECT * FROM products", function(error, response) {

        for (var i = 0; i < response.length; i++) {
            console.log(response[i].id + ": " + response[i].product_name + " | " + response[i].department_name + " | $" + response[i].price);
        };

        //function that allows user to identify the product and quantity of the product he wants to buy
        buyerSearch();
    });

};

//function that prompts users with two questions using Inquirer CDN

var buyerSearch = function () {

    //QUESTION1: identify the product and quanity that the user wants to buy
    inquirer.prompt([{
        name: "productId",
        type: "input",
        message: "What is the ID of the product you'd like to buy?"
    }, {
        name: "productUnits",
        type: "input",
        message: "How many units of the product would you like to buy?"
    }]).then (function(answer){

        //store the product id and units as variables
   
        var productId = answer.productId;
        var productUnits = answer.productUnits;

        //run a query for the product based on the id and save properties as variables to use later

        connection.query("SELECT product_name, stock_quantity, price FROM products WHERE id=?", [productId], function(error, response) {
                    
            var productName = response[0].product_name;
            var stock_quantity = response[0].stock_quantity
            var newStockQuantity = stock_quantity - productUnits;
            var price = response[0].price;
            var totalDue = price * productUnits;

            //check to see if there are enough units to purchase, if there are then tell the user how much she owes and update the database quanity

            if (stock_quantity >= productUnits) {
                
                console.log ("You owe: $" + totalDue);

                connection.query("UPDATE products SET ? WHERE ?", [
                    {stock_quantity: newStockQuantity},
                    {id: productId}], function(error, response) {
                        console.log("Item # " + productId + " has been updated in the Database. The new inventory quantity for " + productName + " is " + newStockQuantity + " units.");
                        });

            } else {
                console.log ("there isn't enough stock");
            }

        });
          
    }); 

};