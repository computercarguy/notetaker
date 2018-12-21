<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>NoteTaker: A Code Test By Eric Ingamells</title>
	<script src="notescripts.js"></script>
	<script src="notesModel.js"></script>
	<script src="scripts.js"></script>
	<link rel="stylesheet" type="text/css" href="notes.css" >
</head>
<body onload="verify()">
	<noscript>
		JavaScript needs to be enabled to run this application.
	</noscript>

	<div id="noteboard">
		<input type="image" src="./images/addnote.svg" id="addnote" class="addnote" title="Add Note" />
		<input type="image" src="./images/instructions.svg" id="instructions" title="Instructions" />
		<!--  Re-add for v2
		<input type="image" src="./images/hamburger.svg" id="apphamburger" />
		<div id="noteboardMenu">
			<table>
				<tr>
					<td><label for="viewMode" >View:</label></td>
					<td><select id="viewMode">
							<option value="0">Stickies</option>
							<option value="1">List</option>
						</select>
					</td>
				</tr>
				<tr>
					<td><label for="themeMode" >Theme:</label></td>
					<td><select id="themeMode">
							<option value="0">Light</option>
							<option value="1">Dark</option>
						</select>
					</td>
				</tr>
				<tr>
				  <td><input type="button" value="Log Out" onclick="logout()" /></td>
				</tr>
			</table>
		</div>
		-->
		<input type="image" src="./images/close.svg" class="logout" title="Log Out" id="logout" />
		<div id="stickieMenu">
			<table>
				<tr>
					<td><label for="colorStyle" >Color:</label></td>
					<td><select id="colorStyle">
							<option value="0">Red</option>
							<option value="1">Blue</option>
							<option value="2">Green</option>
							<option value="3">Pink</option>
							<option value="4">Purple</option>
							<option value="5">Orange</option>
							<option value="6">Brown</option>
							<option value="7">Tan</option>
							<option value="8">Yellow</option>
							<option value="9">Gray</option>
						</select>
					</td>
				</tr>
				<tr>
					<td><input type="button" value="Apply" id="applyChanges"/></td>
					<td><input type="button" value="Cancel/Close" id="cancelClose"/></td>
				</tr>
				<tr>
				  <td colspan="2"><hr /></td>
				</tr>
				<tr>
					<td colspan='2' class="textCenter"><input type="button" value="Delete Note" id="delete"/></td>
				</tr>
			</table>
		</div>
		<div id="imageUpload">
			<table class="imageUpload">
				<tr>
					<td>Add image:</td>
					<td><input type="file" id="filename" accept=".gif, .jpg, .jpeg, .png, .svg"/></td>
				</tr>
				<tr>
					<td colspan="2">
						<div id="imagePreview">
							<img id="imageElement" src="./images/uploadimage.svg" />
							<br />
							<label id="dropText">Drop Image Here</label>
						</div>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="textCenter">
					<input type="button" value="Upload" id="uploadImage" />
					<input type="button" value="Cancel/Close" id="cancelCloseUpload"/>
					<input type="button" value="Delete" id="deleteImage" class="deleteImageDefault" />
					</td>
				</tr>
			</table>
		</div>
	</div>
</body>
</html>
