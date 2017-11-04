/*
This module handles all mysql database jobs
-the executeQuery accepts a query text and then connects to mysql, then create the school database, create the studenstable
-and then execute the query and return the rresult
*/

var mysql = require('mysql');
exports.resultSet = {};

exports.executeQuery = function (queryText)  {
	
	var dbConn = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "nura",
		 host: "127.0.0.1"
	});

	dbConn.connect(function(err) {
		if (err) throw "Error in connecting to mysql database: " +err;
		
		// if no error, create the db if not already created
		else dbConn.query("CREATE DATABASE IF NOT EXISTS SchoolDB ", function (err4, result) {
			if (err4) throw "Error in school database creation: " + err4; //error in database creation
			 
			else {//db created successfully
				//try to connect to the created db
		
				dbConn = mysql.createConnection({
					host: "localhost",
					user: "root",
					password: "nura",
					database: "SchoolDB",
					 host: "127.0.0.1"
					});
			
				dbConn.connect(function(err2) {
					if (err2) throw "Error in connecting to school database: " + err2;
					
					else {
						// create table if not already created
						 var query = "CREATE TABLE IF NOT EXISTS StudentsTable (StdID INT AUTO_INCREMENT PRIMARY KEY, FullName VARCHAR(250), DOB VARCHAR(100), Gender VARCHAR(50), Class VARCHAR(20), HomeAddress VARCHAR(250), PhoneNum VARCHAR(100), Email VARCHAR (250), PassportLoc VARCHAR(250) )";
								dbConn.query(query, function (err3, result) {
							if (err3) throw "Error in creating table: " + err3;
								});
						 // lets executethe requested query
						 
						  dbConn.query(queryText, function (error5, result2) {
							if (error5) throw " Error in executing query ("+ queryText + ") " + error;
								else exports.resultSet = result2;
								});
					}//end db connection is set
				
				});
		
			}//end mysql db is connected
		});
	});
	
}//end func connect o db
