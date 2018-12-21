<?php

include('connection.php');

function accountDetails()
{
	if (isset($_REQUEST['create']))
	{
		if (ConnectMe())
		{
			if (isset($_REQUEST["password"])){
				$username = $_REQUEST["username"];
				$password = $_REQUEST["password"];
				$fullName = $_REQUEST["fullName"];
				$email = $_REQUEST["email"];
				
				$rowCount = GetLoginCredentials($username, $password);
				
				if ($rowCount != 0)
				{
					echo "username taken";
				}
				else
				{
					CreateUser($username, $password, $fullName, $email);
					
					setupSession(3600);
					
					$_SESSION["username"] = $username;
					$_SESSION["password"] = $password;
					$_SESSION["last_activity"] = time();
					
					echo "user created";
				}
			}
			else 
			{
				echo false;
			}
		}
		else 
		{
			echo false;
		}
	}
	else 
	{
		if (ConnectMe())
		{
			$username = "";
			$password = "";
			
			if (isset($_REQUEST["password"])){
				$username = $_REQUEST["username"];
				$password = $_REQUEST["password"];
				
				$rowCount = GetLoginCredentials($username, $password);

				if ($rowCount == 1)
				{
					setupSession(3600);

					$_SESSION["username"] = $username;
					$_SESSION["password"] = $password;
					$_SESSION["last_activity"] = time();
					
					UpdateAccess($username, $password);
					
					echo "success";
				}
				else 
				{
					echo http_response_code(401);
				}
			}
			else 
			{
				echo http_response_code(401);
			}
		}
		else 
		{
			echo http_response_code(401);
		}
	}
}

function setupSession($timeout)
{
	$params = array('cookie_lifetime' => $timeout);
	session_start($params); 

	ini_set("session.gc_maxlifetime", $timeout);
	ini_set("session.cookie_lifetime", $timeout);
}

function Logout()
{
	@session_unset();
	@session_destroy();
	echo "loggedout";
}

function CreateUser($username, $password, $fullName, $email)
{
	global $mysqli;
	$SQLCode = "INSERT INTO users " .
		" (" .
		"   USER_NAME, " .
		"   PASSWORD, " .
		"   NAME, " .
		"   EMAIL, " .
		"   CREATED_ON " .
		" ) " .
		" VALUES (" .
		"   ?, " .
		"   ?, " .
		"   ?, " .
		"   ?, " .
		"   NOW() " .
		" ) ";
	$stmt = $mysqli->prepare($SQLCode);
	$stmt->bind_param("ssss", $username, $password, $fullName, $email);
	$stmt->execute();
	
	$stmt->close();
}

function GetLoginCredentials($username, $password)
{
	global $mysqli;
	
	$SQLCode = "SELECT COUNT(*) " .
		" FROM users " .
		" WHERE USER_NAME = ? AND " .
		" PASSWORD = ?";
	$stmt = $mysqli->prepare($SQLCode);
	$stmt->bind_param("ss", $username, $password);
	$stmt->execute();
	$stmt->bind_result($rowCount);
	$stmt->fetch();
	$stmt->close();
	
	return $rowCount;
}

function GetLoginUsername($username, $password)
{
	global $mysqli;
	
	$SQLCode = "SELECT COUNT(*) " .
		" FROM users " .
		" WHERE USER_NAME = ?";
		
	$stmt = $mysqli->prepare($SQLCode);
	$stmt->bind_param("s", $username);
	$stmt->execute();
	$stmt->bind_result($rowCount);
	$stmt->fetch();
	$stmt->close();
	
	return $rowCount;
}

function GetLoginId($username, $password)
{
	global $mysqli;
	
	$SQLCode = "SELECT ID " .
		" FROM users " .
		" WHERE USER_NAME = ? AND " .
		" PASSWORD = ?";
		
	$stmt = $mysqli->prepare($SQLCode);
	$stmt->bind_param("ss", $username, $password);
	$stmt->execute();
	$stmt->bind_result($userId);
	$stmt->fetch();
	$stmt->close();
	
	return $userId;
}

function UpdateAccess($username, $password)
{
	global $mysqli;
	
	$SQLCode = "UPDATE users " .
		" SET LAST_ACCESS = NOW() " .
		" WHERE USER_NAME = ? AND " .
		" PASSWORD = ?";
	$stmt = $mysqli->prepare($SQLCode);
	$stmt->bind_param("ss", $username, $password);
	$stmt->execute();

	$stmt->close();
}

?>