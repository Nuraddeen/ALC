var fs = require('fs');

 
 exports.display = function (taskType, textOrFileName) {
	 if (taskType == "Read" ) {
		 //read file if exists, else read Register,html
	 }//end read file
	 
	 else {//a text is shown for display
		 
	 }
 }
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  fs.readFile(filename, function(err, data) {
    if (err) {
			
		 fs.readFile("Register.html", function(err2, data2) {
			if (err2) {
		
			res.writeHead(404, {'Content-Type': 'text/html'});
			return res.end("<h2 style= 'color:#F00'> 404 Error  </h2> The Register.html file is not found in this server");
			}

			else 	{		
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write("<h2 style= 'color:#F00'> 404 Error  </h2> That file is not found in this server, the default page is displayed");
			res.write(data2);
			//var conn = modDB.connectToDB();
			
			modDB.executeQuery ("INSERT INTO StudentsTable (FullName, DOB) VALUES ('Nura', '03-04-1991')");
			return res.end();
			}//end success
		});
		
    }//end err in reading the requested file 
	else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
	}
  });
 