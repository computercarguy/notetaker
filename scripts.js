function setupLoginPage()
{
	document.getElementById("username").addEventListener("keyup", enterPressed);
	document.getElementById("password").addEventListener("keyup", enterPressed);
}

function login()
{
	// not secure, but enough for a test site
	var saltedhash = MD5(password.value + username.value);
	logon.disabled = true;
		
	var returnMethod = function(xhr){
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
			  console.log(xhr.responseText);
			  if (xhr.responseText == "success")
			  {
				  window.location = "notetaker.php";
			  }
			  else
			  {
				  document.getElementById("errorMessage").innerText = "Logon failed";
			  }
			  logon.disabled = false;
			} else {
			  console.error(xhr.responseText);
			  logon.disabled = false;
			  document.getElementById("errorMessage").innerText = "Logon failed";
			}
		}
	};
	
	var url = "account.php?username=" + username.value + "&password=" + saltedhash;
	
	getAjax(url, returnMethod);
}

function enterPressed(event)
{
	if (event && event.keyCode && (event.keyCode == 13))
	{
		var username = document.getElementById("username").value;
		var password = document.getElementById("password").value;
		
		if (username && password)
		{
			login();
		}
	}
}

function createLogin()
{
	if ((password.value == "") || (password.value != password2.value))
	{
		errorMessage.innerHTML = "Passwords don't match.";
	}
	else
	{
		// not secure, but enough for a test site
		var saltedhash = MD5(password.value + username.value);
		saveButton.disabled = true;
		
		var returnMethod = function(xhr){
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
				  console.log(xhr.responseText);
				  saveButton.disabled = false;
				  
				  if (xhr.responseText == "username taken")
				  {
					  alert("That username is already taken.\nPlease choose another username.");
				  }
				  else if (xhr.responseText == "user created")
				  {
					  alert("User successfully created!");
					  window.location = "notetaker.php";
				  }
				  else 
				  {
					  alert("We're sorry, we are unable to create your user account at this time.");
				  }
				} else {
				  console.error(xhr.responseText);
				}
			}
		};
		
		var url = "account.php?create=true&fullName=" + fullName.value + "&username=" + username.value + "&password=" + saltedhash + "&name=" + name.value + "&email=" + email.value;
		
		postAjax(url, returnMethod);
	}
}

function comparePassword()
{
	if (password2.value != "")
	{
		if (password.value != password2.value)
		{
			passwordMessage.style.color = "red";
			passwordMessage.innerHTML = "Passwords don't match.";
		}
		else 
		{
			passwordMessage.style.color = "green";
			passwordMessage.innerHTML = "Passwords match!";
		}
	}
}

function sendEmail()
{
	var returnMethod = function(xhr){
		if (xhr.readyState === 4) {
			sentMessage.innerHTML = "Email sent if address matches any accounts.";
		}
	};
	
	var url = "account.php?email=" + email.value;
	
	asyncPostAjax(url, returnMethod);
}

function resetAccount()
{
  fullName.value = "";
  username.value = "";
  email.value = "";
  password.value = "";
  password2.value = "";
  passwordMessage.value = "";
  errorMessage.value = "";
}

function asyncGetAjax(url, returnMethod, data)
{
	ajaxHelper(url, returnMethod, true, "GET", data);
}

function asyncPostAjax(url, returnMethod, data)
{
	ajaxHelper(url, returnMethod, true, "POST", data);
}

function getAjax(url, returnMethod, data)
{
	ajaxHelper(url, returnMethod, false, "GET", data);
}

function postAjax(url, returnMethod, data)
{
	ajaxHelper(url, returnMethod, false, "POST", data);
}

function ajaxHelper(url, returnMethod, async, method, data){
	var xhr = new XMLHttpRequest();
	
	xhr.open(method, url, async);

	xhr.onload = function (e) {
	  returnMethod(xhr);
	};

	xhr.onerror = function (e) {
		console.error(xhr.statusText);
	};
	
	xhr.setRequestHeader('Content-Type', 'application/json');
	
	if (data)
	{
		xhr.send(JSON.stringify(data));
	}
	else{
		xhr.send(null);
	}
}
