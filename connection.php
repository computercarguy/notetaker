<?php

function ConnectMe(){
    global $mysqli;
    $mysqli  = new mysqli("localhost:3306", "notetaker", "N0ne1N0ne1");
    //$mysqli  = @new mysqli('notetaker.db.4278474.0d5.hostedresource.net', "notetaker", "N0ne1N0ne1!");
	
    if (!$mysqli ) {
        return false;
    }

    if (!mysqli_select_db($mysqli , 'notetaker')) {
        @mysqli_close($mysqli );
        return false;
    }
    return true;
}
?>