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
   
    // if no error run function for manipulating inventory
    
    runSearch();
});

// function with four options to manipulate inventory 

var runSearch = function () {
	inquirer.prompt({
		name: "action",
		type: "list",
		message: "What would you like to do?",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	}).then (function(answer){
		switch (answer.action) {
			case "View Products for Sale":
				productsForSale();
				break;

			case "View Low Inventory":
				lowInventory();
				break;

			case "Add to Inventory":
				addInventory();
				break;

			case "Add New Product":
				addProduct();
				break;
		}
	});
};


//List of functions for each of the above options

//CASE 1: View Products for Sale function – allow user to see a list of all available products for sale

var productsForSale = function () {

    connection.query("SELECT * FROM products", function(error, response) {

        for (var i = 0; i < response.length; i++) {
          	console.log(response[i].id + ": " + response[i].product_name + " | " + response[i].department_name + " | $" + response[i].price + " | " + response[i].stock_quantity + " in stock" )
        };
    });

    runSearch(); 

};


//CASE 2: View low inventory function – allow user to see a list of all products where the stock amount is less than five

var lowInventory = function () {

    connection.query("SELECT * FROM products", function(error, response) {

    	for (var i = 0; i < response.length; i++) {
	       	var stock = response[i].stock_quantity;
	       	if (stock <= 5) {console.log ("Low Inventory Alert: " + response[i].product_name)
	       } 

	   //do i need an else statement?
	    };


    });
    runSearch(); 
};


//CASE 3: Add Inventory function – allow user to update inventory of products for sale

var addInventory = function () {

    connection.query("SELECT product_name, stock_quantity FROM products", function(error, response) {
    	// var productNameArray = response.map(function(item) {
    	// 	return item.product_name;
    	// })

    	//create empty array to store products

    	var productNameArray = [];

    	for (var i = 0; i < response.length; i++) {
	       	var productName = response[i].product_name;
	       	productNameArray.push(productName);
	    } 
	       
		//Ask user to select product and set new inventory amount.

		inquirer.prompt([{
	        name: "productToUpdate",
	        type: "list",
	        message: "What would you like to update?",
	        choices: productNameArray
	       
	    }, {
	    	name: "productQuanityToAdd",
	    	type: "input",
	    	message: "What is the total amount of the item that you want in stock?"
	    } ]).then (function(answer){

	    	//take user's answer and convert it to an integer
	    	var newStockQuantity = parseInt(answer.productQuanityToAdd);
	    	
	    	//upate stock_quantity in the database and when it's update console.log update
	    	connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newStockQuantity}, {product_name: answer.productToUpdate}], function(error, response) {
                console.log(answer.productToUpdate + " has been updated in the Database. The new inventory quantity is " + newStockQuantity + " units.");
                runSearch(); 
             });
	    	

	    });


    });



};

//CASE 4: Add Product – allow user to see add product to database

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


		    	connection.query('INSERT INTO products SET ?', 
	                    {product_name: newProduct,
	                    department_name: department,
	                    price: price,
	                    stock_quantity: stock}, 

	                    function(error, response){
	                    	if(error) {
						        console.log(error);
						    } 
						    console.log ("Inventory has been updated to add " + newProduct);
	                    	// console.log(response);
	        			runSearch(); 
	        			}); 

	    	});
};

