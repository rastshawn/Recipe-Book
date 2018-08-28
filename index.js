var mysql = require('mysql');
var credentials = require('./credentials.js');

var connection = mysql.createConnection(credentials);

connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected");
});
