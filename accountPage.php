<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Notes: A Code Test By Eric Ingamells</title>
	<script src="scripts.js"></script>
	<script src="md5hash.js"></script>
</head>
<body>
	<p style="text-align:center;">
<?php if (isset($_REQUEST['create'])) : ?>
		<label style='text-align:center;color:red;font-size:xx-large'><b>Create Account:</b></label>
<?php else : ?>
		<label style='text-align:center;color:red;font-size:xx-large'><b>Account Information:</b></label>
<?php endif; ?>
	</p>
	<br />
	<form>
		<table style="margin-left: auto; margin-right: auto;">
			<tr>
				<td>Name:</td>
				<td><input type="text" id="fullName" required/></td>
			</tr>
			<tr>
				<td>Username:</td>
				<td><input type="text" id="username" required/></td>
			</tr>
			<tr>
				<td>Email address:</td>
				<td><input type="email" id="email" required/></td>
			</tr>
			<tr>
				<td colspan="2" style="text-align:center;wrap:white-space"><b>This is not a secure connection,<br />so use a generic password for your own protection.</b></td>
			</tr>
			<tr>
				<td>Password:</td>
				<td><input type="password" id="password"  onkeyup="comparePassword()" required/></td>
			</tr>
			<tr>
				<td>Re-type Password:</td>
				<td><input type="password" id="password2" onkeyup="comparePassword()"/></td>
			</tr>
			<tr>
				<td></td>
				<td id="passwordMessage"></td>
			</tr>
			<tr>
				<td></td>
			  <td id="errorMessage" style="color:red"></td>
			</tr>
			<tr>
				<td style="text-align:center"><input type="button" value="Save" id="saveButton" onclick="createLogin()"/></td>
				<td style="text-align:center"><input type="button" value="Reset" onclick="resetAccount()" /></td>
			</tr>
		</table>
	</form>
</body>
</html>