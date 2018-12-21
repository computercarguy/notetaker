<?php

include('accountMethods.php');

$mysqli  = "";

if (isset($_REQUEST["logout"]))
{
	Logout();
}
else 
{
	accountDetails();
}	

?>