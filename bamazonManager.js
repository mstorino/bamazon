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
    
    runSearch();
});

var runSearch = function () {
	inquirer.prompt({
		name: "action",
		type: "list",
		message: "What would you like to do?",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	}).then (function(answer){
		switch (answer.action) {
			case "View Products for Sale":
				// console.log("user wants to View Products for Sale");
				productsForSale();
				break;
			case "View Low Inventory":
				// console.log("user wants to View Low Inventory");
				lowInventory();
				break;
			case "Add to Inventory":
				// console.log("user wants to Add to Inventory");
				addInventory();
				break;
			case "Add New Product":
				// console.log("user wants to Add New Product");
				addProduct();
				// addStuff();
				break;
		}
	});
};


//search functions

var productsForSale = function () {

    connection.query("SELECT * FROM products", function(error, response) {

        for (var i = 0; i < response.length; i++) {
          	console.log(response[i].id + ": " + response[i].product_name + " | " + response[i].department_name + " | $" + response[i].price + " | " + response[i].stock_quantity + " in stock" )
        };
    });

    //runSearch(); this is functioning weird

};


var lowInventory = function () {

    connection.query("SELECT * FROM products", function(error, response) {

    	for (var i = 0; i < response.length; i++) {
	       	var stock = response[i].stock_quantity;
	       	if (stock <= 5) {console.log ("Low Inventory Alert: " + response[i].product_name)
	       } 

	   //do i need an else statement?
	    };


    });

};



var addInventory = function () {

    connection.query("SELECT id, product_name, stock_quantity FROM products", function(error, response) {


    	var productId = response[0].id;
    	var productName = response[0].product_name;
    	var productQuantity = response[0].stock_quantity;



		inquirer.prompt([{
	        name: "productToUpdate",
	        type: "list",
	        message: "What would you like to add?",
	        choices: [productName]
	    }, {
	    	name: "productQuanityToAdd",
	    	type: "input",
	    	message: "how much would you like to add?"
	    } ]).then (function(answer){
	    	var amountToAdd = parseInt(answer.productQuanityToAdd);
	    	var newStockQuantity = amountToAdd + productQuantity;

	    	// console.log(newStockQuantity);
	    	 connection.query("UPDATE products SET ? WHERE ?", [
                    {stock_quantity: newStockQuantity},
                    {id: productId}], function(error, response) {
                        console.log("Item # " + productId + " has been updated in the Database. The new inventory quantity for " + productName + " is " + newStockQuantity + " units.");
                        });

	    	
	    });


    });

};


var addProduct = function () {

	inquirer.prompt([{
	        name: "newProductName",
	        type: "input",
	        message: "What would you like to add?"
	       
	    }, {
	    	name: "departmentName",
	    	type: "list",
	    	message: "What Department",
	    	choices: ["grocery", "clothing", "accessories", "office", "cleaning"]
	    }, {
	    	name: "price",
	        type: "input",
	        message: "What's the price per unit?"
	    }, {
	    	name: "stock",
	        type: "input",
	        message: "How many would you like to add?"
	    }]).then (function(answer){
	    	
		    	var newProduct = answer.newProductName;
		    	var department = answer.departmentName;
		    	var price = parseInt(answer.price);
		    	var stock = parseInt(answer.stock);

		    	console.log (newProduct);
		    	console.log (department);
		    	console.log (price);
		    	console.log (stock);

		    	connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?' [
	                    {product_name: newProduct},
	                    {department_name: department},
	                    {price: price},
	                    {stock_quantity: stock}], 

	                    function(error, response){
	                    	if(err) {
						        console.log(err);
						    } 
	                    	console.log(response);
	        			}); 

	    	});
};

// var addStuff = function(){
// 	connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('cheese', 'grocery', 10, 4)", 
// 		function(error, response){
//                         console.log("added to Database");
//         }); 
	
// }

