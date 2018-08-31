var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var hbs = handlebars.create({
	defaultLayout: 'default',
	partialsDir : 'views/partials/'
});
var app = express();
app.use(bodyParser.json());
var mysql = require('mysql');

// make a file called credentials.js where exports contains:
/*
module.exports = {
	"user" : "yourUsername",
	"password" : "yourPassword",
	"host" : "localhost",
	"database" : "yourDatabase"
};
*/
var credentials = require('./credentials.js');

var connection = mysql.createConnection(credentials);



//// ENABLING ADMIN IS VERY INSECURE. ONLY USE FOR ADDING RECIPES
var PORT = 4000;
var admin = false;
process.argv.forEach(function (arg) {
     if (arg == "-admin") {
        admin = true;
        PORT = 4001;
     }
});



// connect to the database, alert if there's a problem
connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected");
});

// Let the app use Handlebars for templating
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Run on the specified port
app.listen(PORT);

// Homepage function
app.get('/', function(req, res){
	connection.query(
		"SELECT MealID, Name, Difficulty FROM Meal",
		function(err, response){
			if (err) {
				res.send("something broke");
				return;
			}

			res.render('home', {"recipes" : response});
		}
	);

});

// THIS IS WILDLY INSECURE.
// Only enable when you're adding recipes. Run preferably on an internal port.
if (admin) {
		app.get('/admin', function(req, res){
			res.render('add');
		});

		app.get('/admin/searchIngredients/:query?', function(req, res) {
			var query = req.params.query;
			connection.query("SELECT * FROM Ingredient WHERE Name LIKE '%" + query + "%'",
				function(err, result) {
					if (err) {
						res.send("something broke");
						return;
					}

					res.send(result);	
				}
			); 
		});
		
		app.post('/admin/ingredient/:name', function(req, res) {
			var name = req.params.name;
			connection.query("INSERT INTO Ingredient (Name) VALUES ('" + name + "')",
				function(err, result) {
					if(err) {
						res.send("something broke");
						return;
					}

					res.send("success!");
				}
			);
		});

		app.post('/admin/meal', function(req, res) {
			console.log(req.body);
			var query = "INSERT INTO Meal (Steps, Difficulty, Type, Name) VALUES ";
			query += '("' + req.body.steps + '", ' + 
						req.body.difficulty + ", " + 
						req.body.type + ", " +
						'"' + req.body.name + '")';
			console.log(query);
			connection.query(query, function(err, result) {
				if (err) {
					res.send("something broke");
					return;
				}
				
				connection.query("SELECT LAST_INSERT_ID() AS MealID", function(err, result){
					if (err) {
						res.send("something broke");
						return;
					}
					res.send(result[0]);
				});
			}); 	
		});

		app.post('/admin/mealIngredients', function(req, res) {
			// make VALUES for sql insert
			var MealID = req.body.MealID;
			var VALUES = ""; // (Amount, MealID, IngredientID)	
			req.body.IngredientAmounts.forEach(function(e){
				VALUES += "(" + 
					'"'+e.Amount+'", ' + 
					MealID + ", " + 
					e.IngredientID +
					"),";
			});
			// remove trailing comma from string
			VALUES = VALUES.substring(0, VALUES.length-1);

			var query = "INSERT INTO MealIngredient (Amount, MealID, IngredientID) " +
					"VALUES " + VALUES;
			console.log(query);
			connection.query(query, function(err, result) {
				if (err) {
					res.send("something broke");
					return;
				}

				res.send("success");			
			});
		});
}


// Render the recipes template with the specified recipe number.
// /recipes/1 passes this function 1
app.get('/recipes/:recipe?', function(req, res){
	var mealID = req.params.recipe;
	getMealInfo(mealID).then((meal) => {
		getMealIngredients(mealID).then((ingredients) => {

			// replace \n with <br> for display
			meal.Steps = meal.Steps.replace(/\n/g, '<br>');			

			var responseObject = {
				"meal" : meal,
				"ingredients" : ingredients
			};
			res.render('recipe',responseObject);	
		});
	});	

});


function getMealInfo(id) {
		return new Promise((resolve, reject) => {
			if (isNaN(id)) reject("not a valid meal id");
			connection.query("SELECT * FROM Meal WHERE MealID = " + id,
				function(err, result){
					if (err) console.log(err);
					var meal = result[0];
					resolve(meal);
				}
			);
		});
}


function getMealIngredients(id) {
		return new Promise((resolve, reject) => {
			if (isNaN(id)) reject("not a valid meal id"); 
			connection.query(
				"SELECT Ingredient.Name, MealIngredient.Amount FROM MealIngredient " +
				"INNER JOIN Ingredient ON MealIngredient.IngredientID = Ingredient.IngredientID " + 
				"WHERE MealIngredient.MealID = " + id,
				function(err, result){
					if (err) reject(err);
					var ingredients = result;
					resolve(ingredients);
				}
			);
		});
}

function getAllIngredients(){
	return new Promise((resolve, reject) => {
		connection.query(
			"SELECT * FROM Ingredients",
			function(err, result) {
				if (err) reject(err);
				var ingredients = result;
				resolve(result);
			}
		);
	});
}
