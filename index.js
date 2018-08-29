var express = require('express');
var handlebars = require('express-handlebars');
var hbs = handlebars.create({
	defaultLayout: 'default',
	partialsDir : 'views/partials/'
});
var app = express();

var mysql = require('mysql');
var credentials = require('./credentials.js');

var connection = mysql.createConnection(credentials);

connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected");
	//getMealInfo(1);
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.listen(4000);
app.get('/', function(req, res){
	res.send("it found it");
});

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
