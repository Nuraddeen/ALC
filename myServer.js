var http = require('http');
var url = require('url'); 
var fs = require('fs');
var modDB = require('./MyDBModule');
var formidable = require('formidable');

var errorLog = "", formErrorText =  "";

http.createServer(function (request, result) {
 
  var address =  url.parse(request.url, true),
      pathname = address.pathname;
  
   if (pathname == '/View') {
		//1.1 fetch all students list from db and display them with edit and delete button
		
		 var htmlText = "<html> <head> <title> Registered Students </title> </head> <body> <br/> <br/> <h1 style = 'color:orange; text-align: center; font-weight:bold; background-color:#FFF'>List of Registered Students </h1> <br/> If the list does not appear, please refresh the page.";
		  htmlText += "	<br/> <br/> <a href = 'null'> Back to Home Page</a>";
		   modDB.executeQuery ("SELECT* FROM StudentsTable");
		for (var i=0; i<modDB.resultSet.length; i++) {
			htmlText += "<br/>  <table width = '50%' align = 'center' style = 'border-radius:20px; border: 2px solid #F00; background-color:#fff4c9' >";
		
			//result.write(modDB.resultSet[i].FullName);
			 htmlText += "<tr> <th> Full Name: </th> <td>"+modDB.resultSet[i].FullName+"</td> <td rowspan = '4'> <img width = '100px' height = '100px' style = 'border-radius:50%' src = '"+modDB.resultSet[i].PassportLoc+"' alt = 'student passport' /> </td> </tr>";
			htmlText += "<tr> <th> Date of birth: </th> <td> "+modDB.resultSet[i].DOB+"</td>  </tr>";
			htmlText += "<tr> <th> Gender: </th> <td>"+modDB.resultSet[i].Gender+"</td>  </tr>";
			htmlText += "<tr> <th> Class: </th> <td> "+modDB.resultSet[i].Class+"</td>  </tr>";
			htmlText += "<tr> <th> Address: </th> <td cols = '2' >"+modDB.resultSet[i].HomeAddress+"</td>  </tr>";
			htmlText += "<tr> <th> Phone Number: </th> <td cols = '2' > "+modDB.resultSet[i].PhoneNum+" </td>  </tr>";
			htmlText += "<tr> <th> Email: </th> <td cols = '2' >"+modDB.resultSet[i].Email+"</td>  </tr>";
			htmlText += "<tr> <td colspan = '3'>";
		 	htmlText += "<table  align = 'center'  > <tr> <td><form action = 'Edit' method = 'POST' ><input type = 'text'  name = 'stdID' value = '"+modDB.resultSet[i].StdID+"' hidden = 'hidden' /><input type = 'submit'  value = 'Edit Student Info'   style = 'font-weight:bold; text-align:center; margin-top:10px' align  = 'center' /> "; 
			htmlText += "</form></td> <td><form action = 'Delete'   method = 'POST' > <input type = 'text'  name = 'stdID' value = '"+modDB.resultSet[i].StdID+"' hidden = 'hidden' />  <input type = 'submit'   value = 'Delete Student'   style = 'font-weight:bold; text-align:center; margin-top:10px' align  = 'center' onClick=\"javascript: return confirm('Are you sure you want to delete this student?');\"/ />";  
			htmlText += "</form> </td> </tr></table></td> </tr> </table> ";
		}//end for
		
		htmlText += "</body> </html>";
		result.writeHead(200, {'Content-Type': 'text/html'});
		result.write(htmlText);
		result.end();
	}
  
  
  
	else if (pathname == '/Edit') {
		/*
		3.1 if id is set
			3.1.1 fetch std details from the db
			3.1.2 if std exists
				3.1.2.1 show edit std form with cancel and id field (hidden)
			3.1.3 else 
				3.1.3.1 show error that std does not exists with view all list option
		3.2 else if id is not set
		3.2.1 show error that id is not set with view all list option*/
		
		var delForm = new formidable.IncomingForm();
					delForm.parse(request, function (err, fields, files) {
						if (err) result.end (getResponse('Error',  "Oops! an error has occured ", "Error in uploading passport to temporary folder: "+err));
						else {
							if (fields.stdID != null) {
								//id is set, query and check if student exists
								
								modDB.executeQuery ("SELECT* FROM StudentsTable WHERE StdID = "+fields.stdID);
								
								if (modDB.resultSet.length >0) {
									//show reg from with files filled with info
									 
										var htmlText = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'> ";
										htmlText += "<html xmlns='http://www.w3.org/1999/xhtml'> <head> <meta charset='UTF-8'> <title>Update Student Information </title> <script type = 'text/javascript' src = 'jquery-3.2.1.min.js'></script> <style type = 'text/css>' > .fieldset {  background-color:#fff4c9; font-size:16px; font-weight: bold; } body {  margin-left:200px; margin-right:100px; } .fieldset legend { text-align: center; } .star { font-weight:bold; color:#F00; }</style> </head> <body>  <br/> <h1 style = 'color:orange; text-align: center; font-weight:bold; background-color:#FFF'>Register New Student </h1> ";
										htmlText += "<a href = 'null'> Back to Home Page</a> <br>  ";
										htmlText += "<form  method = 'POST' action = 'Update' name ='frmStudentInfo' enctype='multipart/form-data' >  ";
										htmlText += "All fields marked <span class = 'star' > * </span> are required ";
										htmlText += "<strong><fieldset style = '  background-color:#fff4c9;font-size:16px;font-weight: bold;'> <legend align = 'center'><u>~~~~~~1~ PERSONAL INFORMATION~~~~~~</u> </legend></br> ";
										htmlText += "<table align = 'center'> <tr> <td> ";
										htmlText += "<strong>Full Name<span class = 'star' > * </span> </strong> </td> <td> ";
										htmlText += "<input type = 'text'  name = 'stdName'  placeholder = 'First Name, Middle Name, Last Name' value = '"+modDB.resultSet[0].FullName+"'  size = '70px' style = 'background-color:#fff;' class = 'txfStyle'  required>  <br/><br/> ";
										htmlText += "</td></tr> <tr> <td> <strong> Date of birth<span class = 'star' > * </span> </strong>  </td> <td> ";
										htmlText += "<input type = 'text'  name = 'stdDOB'  placeholder = '02-12-1991' value =  '"+modDB.resultSet[0].DOB+"' size = '70px' style = 'background-color:#fff;' class = 'txfStyle'  required>  <br/><br/> ";
										htmlText += "</td></tr><tr> <td > <strong> Gender<span class = 'star' > * </span> </strong> </td ><td > <select  style = 'width:440px' name =  'stdGender' required >";
										
										if (modDB.resultSet[0].Gender == 'Male') {
											htmlText += "<option value = 'Male' selected = 'selected' > Male </option>  <option value = 'Female'> Female </option> ";
										}
										else {
												htmlText += "<option value = 'Male' > Male </option>  <option value = 'Female'  selected = 'selected' > Female </option> ";
										}
										 
										 
										htmlText += "</select>  <br/><br/> </td> </tr>  <tr> <td><strong> Class<span class = 'star' > * </span> </strong> </td ><td > <select  style = 'width:440px'  name =  'stdClass' required>"; 
										
										if (modDB.resultSet[0].Class == 'Primay 1') {
											htmlText += "<option selected = 'selected' value = 'Primay 1'> Primay 1 </option>  <option value = 'Primay 2'> Primay 2 </option>  <option value = 'Primay 3'> Primay 3 </option>  ";
										}
										else if (modDB.resultSet[0].Class == 'Primay 2')  {
											htmlText += "<option  value = 'Primay 1'> Primay 1 </option>  <option selected = 'selected' value = 'Primay 2'> Primay 2 </option>  <option value = 'Primay 3'> Primay 3 </option>  ";
										}
										 else 	htmlText += "<option  value = 'Primay 1'> Primay 1 </option>  <option  value = 'Primay 2'> Primay 2 </option>  <option selected = 'selected' value = 'Primay 3'> Primay 3 </option>  ";
										
										 
										htmlText += "</select> <br/><br/> </td> </tr> <tr> <td> <strong> Home Address<span class = 'star' > * </span></strong>  </td> <td> ";
										htmlText += "<input type = 'text'  name = 'stdAddress'  placeholder = 'Enter Student Home Address Here' value = '"+modDB.resultSet[0].HomeAddress+"' size = '70px' style = 'background-color:#fff;' class = 'txfStyle' required/>  <br/><br/> ";
										htmlText += "</td> </tr>	<tr><td> <strong> Phone Number <span class = 'star' > * </span> </strong> </td> <td> ";
										htmlText += "<input type = 'text'  name = 'stdPhoneNum'  placeholder = 'Enter Student Phone No Here' value = '"+modDB.resultSet[0].PhoneNum+"' size = '70px' style = 'background-color:#fff;' class = 'txfStyle' required/>  <br/><br/> ";
										htmlText += "</td> </tr> <tr> <td><strong>  Email  <span class = 'star' > * </span> </strong> </td> <td> ";
										htmlText += "<input type = 'text'  name = 'stdEmail'  placeholder = 'Enter Student Email Here' size = '70px' value = '"+modDB.resultSet[0].Email+"' style = 'background-color:#fff;' class = 'txfStyle'  required />  <br/><br/> ";
										htmlText += "</td> </tr> </strong>  </table> </fieldset> </strong> <br/> <br/> ";
						
						 
										htmlText += "<!-- FILE UPLOADS		 blue love loyalty unity   yellow discipline and resourcefullness,  green energy and life !--> ";
										htmlText += "<fieldset style = 'background-color:#fff4c9;font-size:16px;font-weight: bold;'> <legend align = 'center'><u>~~~~~~2~ PASSPORT ~~~~~~ </u> </legend></br> ";
										htmlText += "<table align = 'center'> <tr> <td colspan = '3' > <i> Please note that the passport must be in jpeg, bmp, png or gif format and must not exceed 200KB in size. </i></td> </tr> ";	
						
										htmlText += "<tr> <td> <table> <tr rowspan = '4'> <td><img id = 'imgPassport' name='imgPassport' width = '150px' height = '150px' src = '"+modDB.resultSet[0].PassportLoc+"' /> <br/> <p id = 'imgPstNotif'   style = 'color:#F00'> </p>  </td> </tr>   <tr>  <td> Passport <span class = 'star' > * </span> </td> </tr>   <tr>  <td> <input type='file' accept = 'image/*'  name = 'stdPassport' id = 'stdPassport' onchange = \"previewImage('stdPassport', 'imgPassport', 'imgPstNotif')\"  required/> </td> </tr>   </table> </td> ";
										htmlText += " </tr> </table> </fieldset> <br/> <br/> ";
						
						
										htmlText += "<input type = 'reset' name='btnReset'  value='Reset Fields'  class = 'btnStyle' style = 'float:left; ' /> ";
										htmlText += "<input type = 'text' name='stdID'  value='"+modDB.resultSet[0].StdID+"'  hidden = 'hidden'   /> ";
	
										htmlText += "<input type = 'submit'   value= 'Submit' class = 'btnStyle' style = 'float:right;'/> ";
										htmlText += "<br> <br> </form><br/> <br/> </body> ";

										htmlText += "<script type = 'text/javascript'> ";
										htmlText += "// this function shows selected image b4 upload and checks its validity ";
										htmlText += "function previewImage (srcID,  prevID,  notifID) { ";
										htmlText += "var fileObj = $('#'+srcID)[0].files[0], errorText = ''; var fileSize = fileObj.size,  fileType =  fileObj.type; ";
						 
										htmlText += "if (fileType != 'image/jpeg' && fileType !=  'image/png' && fileType !=  'image/jpeg' && fileType != 'image/bmp' && fileType !=  'image/gif') ";
										htmlText += "errorText = 'Wrong file Type<br/>'; ";
	
										htmlText += "if (fileSize>200000)  errorText += 'File too large (Max is 200kb)'; ";
		
										htmlText += "if (errorText == '' ) { document.getElementById(prevID).src = window.URL.createObjectURL(fileObj); $('#'+notifID).html(''); } else { $('#'+notifID).html(errorText); $('#'+srcID).val(''); document.getElementById(prevID).src =null; }}</script></html>  ";
										
										result.writeHead(200, {'Content-Type': 'text/html'});
										result.write(htmlText);
										result.end();
							}//std is found
								
								else {//std not found, show error
									result.end (getResponse('Error', 'Edit Failure', "The student you are trying to edit does not exists")); 
								}//end std not found
								//show success with options
								 
							}
							
							else {
								//id not set, notify
									result.end (getResponse('Error', "Oops! an error has occured ", "Student ID is required to delete his information"));
									}
						}//no err
					});
		
	}//end edit
  	
	
	
	else if (pathname == '/Register' | pathname == '/Update') {//register new std
		/*
		1.1 get all files
		1.2 validate all files
		1.3 if all files are valid
		1.3.1 save to db and show succes with register new button
		1.4 else show error with register button.
		*/
		
			   var regForm = new formidable.IncomingForm();
					regForm.parse(request, function (err, fields, files) {
						if (err) result.end (getResponse('Error',  "Oops! an error has occured ", "Error in uploading passport to temporary folder: "+err));
						else {//passport uploaded, go ahead and move it to passports folder and get loc and then rgister std
								  //validate form fields here
							formErrorText = validateRegFormFields(fields, files);
								  
							if (formErrorText == "") {//no error
								  var tempPath = files.stdPassport.path;
									var newPath = 'Passports/' + files.stdPassport.name;
									fs.rename(tempPath, newPath, function (err6) {
									if (err6) newPath = tempPath + "\\"+ files.stdPassport.name;
									 
									});
									
									//check if user is registering
									if (pathname == '/Register' )  {
										//check if already exists using name and phone num only
										modDB.executeQuery ("SELECT* FROM StudentsTable WHERE FullName = '"+fields.stdName+ "' AND PhoneNum = '"+fields.stdPhoneNum+ "'");
								
										if (modDB.resultSet.length >0) {//already exists
											// notify error and return
											result.end (getResponse('Error', 'Register Failure', "The student you are trying to register is already registered")); 
											 }//std is found
								
										else {//std not found, add and show success
											var queryText = "INSERT INTO StudentsTable (FullName, DOB, Gender, Class, HomeAddress, PhoneNum, Email, PassportLoc)";
											queryText += " VALUES ('"+fields.stdName+"', '"+fields.stdDOB+"', '"+fields.stdGender+"', '"+fields.stdClass+"', '"+fields.stdAddress+"', '"+fields.stdPhoneNum+"', '"+fields.stdEmail+"', '"+newPath+"')";
			
											modDB.executeQuery (queryText);
											//show success with options
											result.end (getResponse('Success', 'Registration Success', "Student is registered successfully")); 
											}//end std doesnot exists
								
										
									}//end register
									
									else {//update
										//check if stdID is set, then update and notify, else show error
										if (fields.stdID != null ) {//id is set
											//update
											var queryText = "UPDATE StudentsTable SET FullName = '"+fields.stdName+"', DOB = '"+fields.stdDOB+"', Gender = '"+fields.stdGender+"', Class = '"+fields.stdClass+"', HomeAddress = '"+fields.stdAddress+"', PhoneNum = '"+fields.stdPhoneNum+"', Email = '"+fields.stdEmail+"', PassportLoc = '"+newPath+"' ";
											queryText += " WHERE StdID = "+fields.stdID;
											modDB.executeQuery (queryText);
											//show success with options
											result.end (getResponse('Success', 'Update Success', "Student information is updated successfully")); 
											
										}
										else {//id not set
											result.end (getResponse('Error', "Oops! an error has occured ", "Student ID is required to update his information"));
										}
										
									}//update
								  //save details to db
										 
							}//end valid fields
							
							else {//invalid fields, notify
								//show error
								result.end (getResponse('Error', "Oops! an error has occured ", formErrorText));
							}
						
						}
				});
			
		
	}//end reg new std
  
  
  
	else if (pathname == '/Delete') {
		/*
		5.1 if id is set, delete std info and show success with buttons
		5.2 else show error with buttons
		*/
		var delForm = new formidable.IncomingForm();
					delForm.parse(request, function (err, fields, files) {
						if (err) result.end (getResponse('Error',  "Oops! an error has occured ", "Error in uploading passport to temporary folder: "+err));
						else {
							if (fields.stdID != null) {
								//id is set, delete and notify
								modDB.executeQuery ("SELECT* FROM StudentsTable WHERE StdID = "+fields.stdID);
								
								if (modDB.resultSet.length >0) {
									// std exists, u can go ahead and delete
									modDB.executeQuery ("DELETE FROM StudentsTable WHERE StdID = "+fields.stdID);
									//show success with options
									result.end (getResponse('Success', 'Delete Success', "Student is deleted successfully")); 
								}//std is found
								
								else {//std not found, show error
									result.end (getResponse('Error', 'Delete Failure', "The student you are trying to delete does not exists")); 
								}
								
							}
							
							else {
								//id not set, notify
									result.end (getResponse('Error', "Oops! an error has occured ", "Student ID is required to delete his information"));
									}
						}//no err
					});
		
	}//end delete
	
	
	
	else if (pathname == '/Register.html') {
		displayRegForm () ;
	}//end delete
	
	
	
	else {//show register.html file by default
		 result.end (getResponse ("Success", "Welcome", "Please Pick a task below to continue"));
	}//end show register
  
  
function getResponse (errType, title, response) {// displays error/success messages
	var responseText = "<div style = 'background-color:#fff4c9;' align = 'center'> ";
	if (errType == "Error" ) {
		responseText += "<h2 style= 'color:#F00'>"+title+"<br/> </h2> <span style = 'color:#F00;'> <ul style = 'text-align:left' > "+response+"<ul></span> ";
	}
	
	else {
		responseText += "<h2 style= 'color:#208714'>"+title+" <br/> </h2><span style = 'color:#208714;'> <ul style = 'text-align:left'> "+response+" </ul> </span>";
	
	}
	
	//add buttons for view list and register student
	
	responseText += "<br/> <br/> <table align = 'center' > <tr   > <td  style = 'width:220px' > <form Method = 'Get' action = 'View'> <input style = 'height:35px; font-weight: bold' type = 'submit' value = 'View Registered Students'/> </form> </td>";
	responseText += " <td  style = 'width:220px'> <form Method = 'Get' action = 'Register.html'> <input style = 'height:35px; font-weight: bold' type = 'submit'  value = 'Register New Student'/> </form> </td> </tr> </table> <br/> <br/> </div>";
	return responseText;
}
  
  
function displayRegForm () {//display register.html file
	fs.readFile("Register.html", function(err2, data2) {
			if (err2) {
		
			result.writeHead(404, {'Content-Type': 'text/html'});
			return result.end("<h2 style= 'color:#F00'> 404 Error  </h2> The Register.html file is not found in this server");
			}

			else 	{		
			result.writeHead(200, {'Content-Type': 'text/html'});
			result.write(data2);
			return result.end();
			}//end success
		}); 
}//end display reg form  


function validateRegFormFields (fields, files) {//validate reg form fields and return a msg
	errorLog = "";
	
		if (fields.stdName == null) errorLog += "<li> Studentss Name is required </li>";
		if (fields.stdDOB == null) errorLog += "<li> Student date of birth is required </li>";
		if (fields.stdGender == null) errorLog += "<li> Student gender is required </li>";
		if (fields.stdClass == null) errorLog += "<li> Student class is required </li>";
		if (fields.stdAddress == null) errorLog += "<li> Student address is required </li>";
		if (fields.stdPhoneNum == null) errorLog += "<li> Student phone number is required </li>";
		if (fields.stdEmail == null) errorLog += "<li> Student email is required </li>";
		if (files.stdPassport == null) errorLog += "<li> Student passport is required </li>";
		
		return errorLog;
		
		
}

}).listen(8080); 

