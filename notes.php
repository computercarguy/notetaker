<?php

include('accountMethods.php');
include('notesModel.php');

$mysqli = "";
$cookieTimeout = 3600;

determineResults();

function determineResults()
{
	global $cookieTimeout;
	
	if (session_status() == PHP_SESSION_NONE)
	{
		setupSession($cookieTimeout);

		$username = $_SESSION["username"];
		$password = $_SESSION["password"];
		$timeProgressed = time() - $_SESSION["last_activity"];
		
		if ((isset($_SESSION["last_activity"]) && ($timeProgressed > $cookieTimeout)) ||
			(empty($username) || empty($password)))
		{
			Logout();
			echo http_response_code(401);
		}
		else
		{
			$_SESSION["last_activity"] = time();

			if (isset($_REQUEST["createNote"]))
			{
				createNote($username, $password);
				return;
			}

			if (isset($_REQUEST["updateNote"]))
			{
				updateNote($username, $password);
				return;
			}
			
			if (isset($_REQUEST["viewMode"]))
			{
				updateViewMode($_REQUEST["viewMode"] * 1, $username, $password);
				return;
			}

			if (isset($_REQUEST["themeMode"]))
			{
				updateTheme($_REQUEST["themeMode"] * 1, $username, $password);
				return;
			}
			
			if (isset($_REQUEST["allNotes"]))
			{
				getAllNotes($username, $password);
				return;
			}
			
			if (isset($_REQUEST["getNote"]))
			{
				getNote($_REQUEST["getNote"] * 1, $username, $password);
				return;
			}

			if (isset($_REQUEST["deleteNote"]))
			{
				deleteNote($username, $password);
				return;
			}
			
			if (isset($_REQUEST["addImage"]))
			{
				addImage($username, $password);
				return;
			}
			
			if (isset($_REQUEST["deleteImage"]))
			{
				deleteImage($username, $password);
				return;
			}
		}
	}
	else
	{
		echo http_response_code(401);
		$_SESSION["username"] = "";
		$_SESSION["password"] = "";
	}
}

function createNote($username, $password)
{
	global $mysqli;
	$noteId = -1;
	
	if (ConnectMe())
	{
		$userId = GetLoginId($username, $password);
		$width = $_REQUEST["width"];
		$height = $_REQUEST["height"];
		$positionX = $_REQUEST["positionX"];
		$positionY = $_REQUEST["positionY"];
		$color = $_REQUEST["color"];
		
		$SQLCode = "INSERT INTO notes " . "\r\n" .
			" (". "\r\n" .
			"	WIDTH, " . "\r\n" .
			" 	HEIGHT, " . "\r\n" .
			" 	POSITION_X, " . "\r\n" .
			" 	POSITION_Y, " . "\r\n" .
			" 	COLOR, " . "\r\n" .
			" 	USER_ID, " . "\r\n" .
			" 	CREATED_ON " . "\r\n" .
			" ) " . "\r\n" .
			" VALUES (?, ?, ?, ?, ?, ?, NOW()); " . "\r\n";
	
		$stmt = $mysqli->begin_transaction();
		if ($stmt = $mysqli->prepare($SQLCode)) {
			$stmt->bind_param("ddddsi", $width, $height, $positionX, $positionY, $color, $userId);
	
			if ($stmt->execute()) {
				$mysqli->commit();
				$stmt2 = $mysqli->prepare(" SELECT LAST_INSERT_ID(); ");
				$stmt2->execute();
				$stmt2->bind_result($noteId);
				$stmt2->fetch();

				$stmt2->close();
			} else {
				$mysqli->rollback();
			}
	
			$stmt->close();
		}
	}
			echo $mysqli->error;
	echo $noteId;
}

function updateTheme($themeMode, $username, $password)
{
	global $mysqli;
	$validOptions = array(0, 1);
	
	if (ConnectMe())
	{
		if (array_search($themeMode, $validOptions) > -1)
		{
			$SQLCode = "UPDATE users " .
				" SET THEME = ? " .
				" WHERE USER_NAME = ? AND " .
				"    PASSWORD = ? ;";
				
			$stmt = $mysqli->prepare($SQLCode);
			$stmt->bind_param("iss", $themeMode, $username, $password);
			$stmt->execute();
			
			$stmt->close();
		}
	}
}

function updateViewMode($viewMode, $username, $password)
{
	global $mysqli;
	$validOptions = array(0, 1);
	
	if (ConnectMe())
	{
		if (array_search($viewMode, $validOptions) > -1)
		{
			$SQLCode = "UPDATE users " .
				" SET VIEW = ? " .
				" WHERE USER_NAME = ? AND" .
				"    PASSWORD = ? ;";
				
			$stmt = $mysqli->prepare($SQLCode);
			$stmt->bind_param("iss", $viewMode, $username, $password);
			$stmt->execute();
			
			$stmt->close();
		}
	}
}

function getAllNotes($username, $password)
{
	global $mysqli;

	if (ConnectMe())
	{
		$userId = GetLoginId($username, $password);
		
		$SQLCode = "SELECT " .
			" notes.ID, " .
			" notes.POSITION_X, " .
			" notes.POSITION_Y, " .
			" notes.COLOR, " .
			" notes.WIDTH, " .
			" notes.HEIGHT, " .
			" notes.LAYER, " .
			" notes.CONTENTS, " .
			" image.ID AS IMAGE_ID, " .
			" image.IMAGE_ENCODE AS IMAGE " .
			" FROM notes " .
			" LEFT JOIN image ON notes.ID = image.NOTE_ID " .
			"	AND image.DELETED = FALSE " .
			" WHERE notes.USER_ID = ? " .
			" AND notes.DELETED = FALSE ";

		if ($stmt = $mysqli->prepare($SQLCode))
		{
			$stmt->bind_param("s", $userId);
			$stmt->execute();

			//  My hosting account doesn't have the $mysqli->get_result() 
			//  method available, so I have to do it differently.
			$column = array("ID", "POSITION_X", "POSITION_Y", "COLOR", "WIDTH", "HEIGHT", "LAYER", "CONTENTS", "IMAGE_ID", "IMAGE");
			$params = array();
			$returnValue = array();
			$results = array();
			
			foreach($column as $col_name) 
			{ 
			  $params[] =& $data[$col_name]; 
			} 
			
			call_user_func_array(array($stmt, "bind_result"), $params);

			while ($stmt->fetch()) 
			{
				$results = setupNotesModelArray($params, $column);
				$returnValue[] = new notesModel($results);
			}

			$stmt->close();
			
			echo json_encode($returnValue);
		}
	}
}

function setupNotesModelArray($values, $column)
{
// Instead of writing a method in the Model to make this work and hope the order 
// and columns of the query don't ever change, I'm writing this method to stuff 
// the raw data into an array with string key values, so the Model constructor 
// doesn't have to change.
	$params = array();
	$i = 0;
	
	foreach($column as $col_name) 
	{ 
	  $params[$col_name] = $values[$i]; 
	  $i++;
	}
	return $params;
}

function getNote($username, $password)
{
	global $mysqli;

	if (ConnectMe())
	{
		$userId = GetLoginId($username, $password);
		$noteId = $_REQUEST["noteId"];
		
		$SQLCode = "SELECT " .
			" notes.ID, " .
			" notes.POSITION_X, " .
			" notes.POSITION_Y, " .
			" notes.COLOR, " .
			" notes.WIDTH, " .
			" notes.HEIGHT, " .
			" notes.LAYER, " .
			" notes.LAYER, " .
			" notes.CONTENTS, " .
			" image.ID AS IMAGE_ID, " .
			" image.IMAGE_ENCODE AS IMAGE " .
			" FROM NOTES " .
			" LEFT JOIN IMAGE ON notes.IMAGE_ID = image.ID " .
			" 	AND image.DELETED = FALSE " .
			" WHERE notes.USER_ID = ? " .
			" AND notes.ID = ? " .
			" AND notes.DELETED = FALSE; ";

		if ($stmt = $mysqli->prepare($SQLCode))
		{
			$stmt->bind_param("sd", $userId, $noteId);
			$stmt->execute();

			$results = $stmt->get_result();
			$returnValue = array();
			
			while ($row = $results->fetch_assoc()) {
				$returnValue[] = new notesModel($row);
			}

			$stmt->close();

			echo json_encode($returnValue);

		}
	}
}

function deleteNote($username, $password)
{
	global $mysqli;

	if (ConnectMe())
	{
		$userId = GetLoginId($username, $password);
		$id = $_REQUEST["id"];
		
		$SQLCode = "UPDATE notes " . "\r\n" .
			" SET ". "\r\n" .
			"	DELETED = TRUE " . "\r\n" .
			" WHERE ID = ? " . "\r\n" .
			" AND USER_ID = ?; " . "\r\n";
			
		if ($stmt = $mysqli->prepare($SQLCode)) {
			$stmt->bind_param("ii", $id, $userId);
			$stmt->execute();

			$stmt->close();
			
			echo "deleted";
		}
		else
		{
			echo http_response_code(500);
		}
	}
	else
	{
		echo http_response_code(500);
	}
}

function updateNote($username, $password)
{
	global $mysqli;

	if (ConnectMe())
	{
		$userId = GetLoginId($username, $password);
		$width = $_REQUEST["width"];
		$height = $_REQUEST["height"];
		$positionX = $_REQUEST["positionX"];
		$positionY = $_REQUEST["positionY"];
		$color = $_REQUEST["color"];
		$contents = $_REQUEST["contents"];
		$layer = $_REQUEST["layer"];
		$id = $_REQUEST["id"];
		
		$SQLCode = "UPDATE notes " . "\r\n" .
			" SET ". "\r\n" .
			"	WIDTH = ?, " . "\r\n" .
			" 	HEIGHT = ?, " . "\r\n" .
			" 	POSITION_X = ?, " . "\r\n" .
			" 	POSITION_Y = ?, " . "\r\n" .
			" 	COLOR = ?, " . "\r\n" .
			" 	CONTENTS = ?, " . "\r\n" .
			" 	LAYER = ? " .
			" WHERE ID = ? " . "\r\n" .
			" AND USER_ID = ?; " . "\r\n";
	
		if ($stmt = $mysqli->prepare($SQLCode)) {
			$stmt->bind_param("ddddssiii", $width, $height, $positionX, $positionY, $color, $contents, $layer, $id, $userId);
			$stmt->execute();

			$stmt->close();
			
			echo "saved";
		}
		else
		{
			echo "failed";
		}
	}
	else
	{
		echo "failed";
	}
}

function addImage($username, $password)
{
	global $mysqli;
	
	$id = null;
	$image = null;
	$image_id = null;
	$request_body = file_get_contents('php://input');
	
	if (isset($request_body))
	{
		$data = json_decode($request_body);
		
		if (property_exists($data, 'id'))
		{
			$id = $data->id;
		}
		
		if (property_exists($data, 'image'))
		{
			$image = $data->image;
		}

		if (property_exists($data, 'image_id'))
		{
			$image_id = $data->image_id;
		}
		
		if (isset($id) && isset($image) && ConnectMe())
		{
			$userId = GetLoginId($username, $password);
			
			if (isset($image_id))
			{
				updateImage($image, $id, $userId, $image_id);
			}
			else
			{
				insertImage($image, $id, $userId);
			}
		}
		else
		{
			echo "failed";
		}
	}
	else
	{
		echo "failed";
	}
}

function insertImage($image, $id, $userId)
{
	global $mysqli;
	
	$SQLCode = "INSERT INTO image " .
		" ( " .
		" 	IMAGE_ENCODE, " .
		" 	NOTE_ID, " .
		" 	USER_ID " .
		" ) " .
		" VALUES " .
		" ( ?, ?, ?);";
		
	$stmt = $mysqli->begin_transaction();
			
	if ($stmt = $mysqli->prepare($SQLCode)) {
		$stmt->bind_param("sii", $image, $id, $userId);
		
		if ($stmt->execute())
		{
			$mysqli->commit();
			$stmt2 = $mysqli->prepare(" SELECT LAST_INSERT_ID(); ");
			
			$stmt2->execute();
			$stmt2->bind_result($imageId);
			$stmt2->fetch();

			$stmt2->close();
			
			echo $imageId;
		} 
		else 
		{
			$mysqli->rollback();
			echo "failed";
		}
		
		$stmt->close();
	}
	else
	{
		echo $mysqli->error;
		echo "failed";
	}
}

function updateImage($image, $id, $userId, $image_id)
{
	global $mysqli;
	
	$SQLCode = "UPDATE image " .
		" SET IMAGE_ENCODE = ? " .
		" DELETED = FALSE " .
		" WHERE NOTE_ID = ? AND " .
		" 	ID = ? AND " .
		" 	USER_ID = ?;";
		
	if($stmt = $mysqli->prepare($SQLCode)) {
		$stmt->bind_param("siii", $image, $id, $image_id, $userId);
		
		if ($stmt->execute())
		{
			echo $image_id;
		} else {
			$mysqli->rollback();
			echo "failed";
		}
		
		$stmt->close();
	}
	else
	{
		echo $mysqli->error;
		echo "failed";
	}
}

function deleteImage($username, $password)
{
global $mysqli;

	if (ConnectMe())
	{
		$userId = GetLoginId($username, $password);
		$id = $_REQUEST["id"];
		$image_id = $_REQUEST["image_id"];
		
		$SQLCode = "UPDATE image " .
		" SET DELETED = TRUE " .
		" WHERE NOTE_ID = ? AND " .
		" 	ID = ? AND " .
		" 	USER_ID = ?;";
	
		if ($stmt = $mysqli->prepare($SQLCode)) {
			$stmt->bind_param("iii", $id, $image_id, $userId);
			$stmt->execute();

			$stmt->close();
			
			echo "saved";
		}
		else
		{
			echo "failed";
		}
	}
	else
	{
		echo "failed";
	}
}

?>