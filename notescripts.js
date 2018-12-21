var colorOptions = ["red", "blue", "green", "pink", "purple", "orange", "brown", "tan", "yellow", "gray"];
var noteData = [];
var stickieNoteId;
var offset = {x:0,y:0};
var noteCount = 0;
var doHideNoteboardMenu = true;
var doHideNoteMenu = true;
var oldClass = "";
var zIndex = 0;

// the variable name "stickieNote" will refer to the HTML element, not the data object
// the variable name "stickieNoteData" will refer to the data object, not the HTML element

function verify()
{
	window.addEventListener('beforeunload', logout);
	
	var returnMethod = function(xhr)
	{
		if (xhr.readyState === 4)
		{
			if (xhr.status == 200) 
			{
				setup();
			} 
			else 
			{
				logout();
			}
		}
	};
	
	var url = "notes.php";
	
	asyncGetAjax(url, returnMethod);
}

function setup()
{
	// Commented out code is for functionality that is temporarily disabled
	document.getElementById("addnote").addEventListener("click", createNote);
	document.getElementById("instructions").addEventListener("click", showInstructions);
	//document.getElementById("apphamburger").addEventListener("click", displayMenu);
	document.getElementById("applyChanges").addEventListener("click", applyNoteChanges);
	document.getElementById("cancelClose").addEventListener("click", removeNoteChanges);
	document.getElementById("delete").addEventListener("click", deleteNote);
	document.getElementById("logout").addEventListener("click", logout);
	
	//document.getElementById("themeMode").addEventListener("change", updateTheme);
	//document.getElementById("viewMode").addEventListener("change", updateView);
	document.getElementById("colorStyle").addEventListener("change", updateNote);
	
	document.addEventListener("mouseup", determineHideNoteboardMenu);
	
	//document.getElementById("noteboardMenu").addEventListener("mouseover", removeNoteboardClickListener);
	//document.getElementById("noteboardMenu").addEventListener("mouseout", addNoteboardClickListener);
	
	document.getElementById("imageUpload").addEventListener("drop", dropImage, false);
	document.getElementById("imageUpload").addEventListener("dragenter", allowDropImage, false);
	document.getElementById("imageUpload").addEventListener("dragover", allowDropImage, false);
	document.getElementById("imageUpload").addEventListener("dragleave", preventDropImage, false);

	document.getElementById("deleteImage").addEventListener("click", deleteImage, false);
	document.getElementById("filename").addEventListener("change", chooseImage, false);
	document.getElementById("uploadImage").addEventListener("click", uploadImage, false);
	
	document.getElementById("cancelCloseUpload").addEventListener("click", hideDragNDrop, false);
	
	getAllNotes();
}
/*
function addNoteboardClickListener()
{
	doHideNoteboardMenu = true;
}

function removeNoteboardClickListener()
{
	doHideNoteboardMenu = false;
}
*/
function createNote(savedNote)
{
	var newStickie = document.createElement("DIV");
	var move = document.createElement("DIV");
	var resize = document.createElement("DIV");
	var addimage = document.createElement("DIV");
	var hamburger = document.createElement("DIV");
	var contents = document.createElement("DIV");
	var noteImage = document.createElement("IMG");
	var noteId;
	var saveCurrentNote = false;
	
	zIndex++;
	
	move.className = "move";
	contents.className = "noteContents";
	noteImage.className = "noteImage";
	resize.className = "resize";
	addimage.className = "addimage";
	hamburger.className = "hamburger";

	newStickie.addEventListener("click", editNote);

	move.addEventListener("mousedown", dragNote);
	move.addEventListener("mouseup", stopDragNote);

	resize.addEventListener("mousedown", resizeNote);
	resize.addEventListener("mouseup", stopResizingNote);
	
	addimage.addEventListener("click", displayDragNDrop);
	hamburger.addEventListener("click", displayStickieMenu);
	
	newStickie.appendChild(contents);
	newStickie.appendChild(noteImage);
	newStickie.appendChild(move);
	newStickie.appendChild(resize);
	newStickie.appendChild(addimage);
	newStickie.appendChild(hamburger);
	
	// display the newStickie to fill in automatically set values
	// then hide it until it's saved, so events work correctly.
	document.getElementById("noteboard").appendChild(newStickie);
	newStickie.style.disply = "none";
	
	if (savedNote && ('color' in savedNote))
	{
		noteId = savedNote.id;
		newStickie.className = "stickie " + savedNote.color;
		newStickie.style.left = savedNote.position_x + "px";
		newStickie.style.top = savedNote.position_y + "px";
		newStickie.style.width = savedNote.width + "px";
		newStickie.style.height = savedNote.height + "px";
		newStickie.style.zIndex = savedNote.layer;

		contents.innerHTML = savedNote.contents;
		
		if (savedNote.image_source)
		{
			noteImage.setAttribute("src", savedNote.image_source);
			noteImage.style.display = "block";
		}

		if (noteCount < savedNote.id)
		{
			noteCount = savedNote.id + 1;  // tries to prevent duplicate element IDs
		}

		if (zIndex < savedNote.layer)
		{
			zIndex = savedNote.layer + 1;  // tries to prevent odd issues with overlapping notes
		}
	}
	else 
	{
		noteCount++;
		noteId = noteCount;
		newStickie.className = "stickie " + colorOptions[0];
		newStickie.style.zIndex = zIndex;
		savedNote = new notesModel();
		
		savedNote.id = noteId;
		savedNote.width = newStickie.getBoundingClientRect().width;
		savedNote.height = newStickie.getBoundingClientRect().height;
		savedNote.position_x = newStickie.getBoundingClientRect().x;
		savedNote.position_y = newStickie.getBoundingClientRect().y;
		savedNote.color = newStickie.className.split(" ")[1];
		savedNote.layer = zIndex;
		noteData.push(savedNote);
		saveCurrentNote = true;
	}

	newStickie.setAttribute("noteid", noteId);
	contents.setAttribute("noteid", noteId);
	
	newStickie.id = "stickie" + noteId;
	contents.id = "contents" + noteId;
	noteImage.id = "image" + noteId;
	move.id = "move" + noteId;
	resize.id = "resize" + noteId;
	addimage.id = "addimage" + noteId;
	hamburger.id = "hamburger" + noteId;

	if (saveCurrentNote)
	{
		stickieNote = noteId;
		saveNote(true, savedNote);
	}
}

function saveNote(createNewNote, currentNote)
{
	var returnMethod = function(xhr)
	{
		if (xhr.readyState === 4)
		{
			if (xhr.status === 401)
			{
				logout();
			}
			else if (xhr.status === 200) 
			{
				if (createNewNote === true)
				{
					//console.log(xhr.responseText);
					var note = document.getElementById("stickie" + currentNote.id);
					
					currentNote.id = xhr.responseText;
					
					note.id = "stickie" + currentNote.id;
					note.setAttribute("noteid", currentNote.id);
					
					// show the saved note
					note.style.display = "block";
				}
			}
			else
			{
				alert("Note didn't save correctly.");
			}
		}
	};
	
	var url = "notes.php?" +
		"width=" + currentNote.width +
		"&height=" + currentNote.height +
		"&positionX=" + currentNote.position_x +
		"&positionY=" + currentNote.position_y +
		"&color=" + currentNote.color +
		"&layer=" + currentNote.layer;
		
		if (createNewNote === true)
		{
			url += "&createNote=true";
		}
		else 
		{
			url += "&updateNote=true" +
				"&contents=" + currentNote.contents +
				"&id=" + currentNote.id;
		}
		
	asyncPostAjax(url, returnMethod);
}

function deleteNote(event)
{
	if (stickieNoteId)
	{
		var returnMethod = function(xhr)
		{
			if (xhr.readyState === 4) 
			{
				if (xhr.status === 401)
				{
					logout();
				}
				else if (xhr.status === 200) 
				{
					for (var i = 0; i < noteData.length; i++)
					{
						if (noteData[i].id == stickieNoteId)
						{
							noteData.splice(i, 1);
							break;
						}
					}
					
					var stickieNote = document.getElementById("stickie" + stickieNoteId);
					
					document.getElementById("noteboard").removeChild(stickieNote);
					stickieNoteId = null;
					hideStickieMenu();
				} else {
					//console.error(xhr.responseText);
				}
			}
		};
		
		var url = "notes.php?deleteNote=true&id=" + stickieNoteId;
		
		asyncPostAjax(url, returnMethod);
	}
}

function hideDragNDrop(event)
{
	var imageUpload = document.getElementById("imageUpload");
	var stickieNoteData = getNoteData(stickieNoteId);
	
	imageUpload.style.display = "none";
		
	if (stickieNoteData)
	{
		stickieNoteData.clearNewImage();
	}
}

function displayDragNDrop(event)
{
	var imageUpload = document.getElementById("imageUpload");
	
	document.getElementById("filename").value = null;

	if (["none",""].indexOf(imageUpload.style.display) === -1)
	{  
		//  clean up the previous note before doing anything for the new note.
		var previousStickieNoteData = getNoteData(stickieNoteId);
		
		if (previousStickieNoteData)
		{
			previousStickieNoteData.clearNewImage();
		}
	}

	var stickieNote = event.srcElement.parentElement;
	
	stickieNoteId = stickieNote.getAttribute("noteid");

	var stickieNoteData = getNoteData(stickieNoteId);
	
	if (stickieNoteData)
	{
		if (stickieNoteData.image_source)
		{
			document.getElementById("dropText").style.display = "none";
			document.getElementById("deleteImage").className = "deleteImageShow";
			document.getElementById("imageElement").setAttribute("src", stickieNoteData.image_source);
		}
		else
		{
			document.getElementById("dropText").style.display = "block";
			document.getElementById("deleteImage").className = "deleteImageDefault";
			document.getElementById("imageElement").setAttribute("src", "./images/uploadimage.svg");
		}
	}
	else
	{
		document.getElementById("dropText").style.display = "block";
		document.getElementById("deleteImage").className = "deleteImageDefault";
		document.getElementById("imageElement").setAttribute("src", "./images/uploadimage.svg");
	}
	
	imageUpload.style.display = "block";
	imageUpload.style.left = event.srcElement.getBoundingClientRect().x + "px";
	imageUpload.style.top = event.srcElement.getBoundingClientRect().y + "px";
}

function getStickieNote()
{
	return document.getElementById("stickie" + stickieNoteId);
}

function updateNote(event)
{
	var colorStyleNumber = 1 * document.getElementById("colorStyle").value;
	var stickieNote = getStickieNote();
	
	if (oldClass === "")
	{
		oldClass = stickieNote.className;
	}

	stickieNote.className = "stickie " + colorOptions[colorStyleNumber];
}

function applyNoteChanges()
{
	oldClass = "";
	hideStickieMenu();
	
	var stickieNoteData = getNoteData(stickieNoteId);
	var stickieNote = getStickieNote();
	
	if (stickieNoteData && stickieNote)
	{
		stickieNoteData.color = stickieNote.className.split(" ")[1];
		saveNote(false, stickieNoteData);
	}
}

function removeNoteChanges()
{
	if (oldClass !== "")
	{
		var stickieNote = getStickieNote();
		
		stickieNote.className = oldClass;
		oldClass = "";
	}
	
	hideStickieMenu();
}

function hideStickieMenu()
{
	document.getElementById("stickieMenu").style.display = "none";
}
/*
function displayMenu()
{
	toggleMenu(document.getElementById("noteboardMenu"));
}
*/
function displayStickieMenu(event)
{
	var stickieMenu = document.getElementById("stickieMenu");
	
	if (["none",""].indexOf(stickieMenu.style.display) === -1)
	{
		removeNoteChanges();
	}
	
	var stickieNote = event.srcElement.parentElement;
	
	stickieNoteId = stickieNote.getAttribute("noteid");
	className = stickieNote.className;
	
	document.getElementById("colorStyle").value = colorOptions.indexOf(className.split(" ")[1]);

	stickieMenu.style.display = "block";
	stickieMenu.style.left = ((event.srcElement.getBoundingClientRect().x + 8) - stickieMenu.getBoundingClientRect().width) + "px";
	stickieMenu.style.top = (event.srcElement.getBoundingClientRect().y + 8) + "px";
}

function hideNoteboardMenu()
{
	//document.getElementById("noteboardMenu").style.display = "none";
}

function toggleMenu(menu)
{
    if (menu.style.display === "none") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

function resizeNote(event)
{
	var stickieNote = event.srcElement.parentElement;
	
	stickieNoteId = stickieNote.getAttribute("noteid");

	document.addEventListener("mousemove", resizingNote);
	
	offset.x = stickieNote.getBoundingClientRect().right - event.clientX;
	offset.y = stickieNote.getBoundingClientRect().bottom - event.clientY;
}

function dragNote(event)
{
	var stickieNote = event.srcElement.parentElement;
	
	stickieNoteId = stickieNote.getAttribute("noteid");

	document.addEventListener("mousemove", draggingNote);
	
	offset.x = event.clientX - stickieNote.getBoundingClientRect().left;
	offset.y = event.clientY - stickieNote.getBoundingClientRect().top;
}

function determineHideNoteboardMenu(event)
{
	if (doHideNoteboardMenu)
	{
		hideNoteboardMenu();
	}
}

function stopDragNote(event)
{
	offset = {x:0,y:0};
	document.removeEventListener("mousemove", draggingNote);
	
	if (stickieNoteId)
	{
		var stickieNote = getStickieNote();
		var stickieNoteData = getNoteData(stickieNoteId);

		if (stickieNoteData)
		{

			stickieNoteData.position_x = stickieNote.style.left.replace("px", "") * 1;
			stickieNoteData.position_y = stickieNote.style.top.replace("px", "") * 1;

			saveNote(false, stickieNoteData);
			stickieNote = null;
		}
	}
}

function stopResizingNote(event)
{
	var stickieNoteData = getNoteData(stickieNoteId);

	document.removeEventListener("mousemove", resizingNote);
	
	if (stickieNoteData)
	{
		var stickieNote = getStickieNote();

		stickieNoteData.width = stickieNote.style.width;
		stickieNoteData.height = stickieNote.style.height;
		saveNote(false, stickieNoteData);
	}
}

function draggingNote(event)
{
	if (stickieNoteId)
	{
		var stickieNote = getStickieNote();
		
		stickieNote.style.left = (event.clientX - offset.x) + "px";
		stickieNote.style.top = (event.clientY - offset.y) + "px";
	}
}

function resizingNote(event)
{
	if (stickieNoteId)
	{
		var stickieNote = getStickieNote();
		var boundingRectangle = stickieNote.getBoundingClientRect();
		
		stickieNote.style.width = ((event.clientX + offset.x) - boundingRectangle.left) + "px";
		stickieNote.style.height = ((event.clientY + offset.y) - boundingRectangle.top) + "px";
	}
}

function preventDefaults (event) 
{
	event.preventDefault()
	event.stopPropagation()
}

function chooseImage(event)
{
	displayImage(event.srcElement.files[0]);
}

function dropImage(event)
{
	preventDefaults(event);
	preventDropImage(event);
	
	displayImage(event.dataTransfer.files[0]);
}

function displayImage(file)
{
	if (file)
	{
		var reader = new FileReader();

		reader.onload = function(e){
			document.getElementById("dropText").style.display = "none";
			document.getElementById("imageElement").setAttribute("src", e.target.result);
			
			var stickieNoteData = getNoteData(stickieNoteId);
			
			stickieNoteData.setNewImage(e.target.result);
		};

		reader.readAsDataURL(file);
	}
}

function allowDropImage(event)
{
	preventDefaults(event);
	
	if (document.getElementById("imagePreview").className.indexOf ("dropHightlight") == -1)
	{
		document.getElementById("imagePreview").className = "dropHightlight";
	}
}

function preventDropImage(event)
{
	preventDefaults(event);
	document.getElementById("imagePreview").className = "";	
}

function logout()
{
	var returnMethod = function(xhr)
	{
		window.location = "login.html";
	};
	
	var url = "account.php?logout=true";
	
	postAjax(url, returnMethod);
}

function uploadImage()
{
	var stickieNoteData = getNoteData(stickieNoteId);
	if (stickieNoteData.new_image_source)
	{
		var returnMethod = function(xhr)
		{
			if (xhr.readyState === 4) 
			{
				if (xhr.status === 401)
				{
					logout();
				}
				else if (xhr.status === 200) 
				{
					//console.log(xhr.responseText);
					var stickieNoteData = getNoteData(stickieNoteId);
					stickieNoteData.setImage(stickieNoteData.new_image_source);
					stickieNoteData.setImageId(xhr.responseText);
					stickieNoteData.clearNewImage();
					
					var noteImage = document.getElementById("image" + stickieNoteId);
					noteImage.setAttribute("src", stickieNoteData.image_source);
					noteImage.style.display = "block";
					
					stickieNoteId = null;
					hideDragNDrop();
				}
			}
		};
	
		var url = "notes.php?addImage=true";
		var data = {
			id:  stickieNoteId,
			image: stickieNoteData.new_image_source,
			image_id: stickieNoteData.image_id
		};

		asyncPostAjax(url, returnMethod, data);
	}
}

function deleteImage(event)
{
	var stickieNoteData = getNoteData(stickieNoteId);
	
	if (stickieNoteData.image_id)
	{
		var returnMethod = function(xhr)
		{
			if (xhr.readyState === 4) 
			{
				if (xhr.status === 401)
				{
					logout();
				}
				else if (xhr.status === 200) 
				{
				  //console.log(xhr.responseText);
					stickieNoteData.deleteImage();
					hideDragNDrop();
					
					var noteImage = document.getElementById("image" + stickieNoteData.id);
					noteImage.setAttribute("src", "");
					noteImage.style.display = "none";
					
				} else {
				  //console.error(xhr.responseText);
				}
			}
		};
		
		var url = "notes.php?deleteImage=true" + 
			"&image_id=" + stickieNoteData.image_id +
			"&id=" + stickieNoteData.id;
		
		asyncPostAjax(url, returnMethod);
	}
}
/*
function updateView()
{
	var returnMethod = function(xhr)
	{
		if (xhr.readyState === 4) 
		{
			if (xhr.status === 401)
			{
				logout();
			}
			else if (xhr.status === 200) 
			{
			  console.log(xhr.responseText);
			} else {
			  //console.error(xhr.responseText);
			}
		}
	};
	
	var url = "notes.php?viewMode=" + viewMode.value;
	
	asyncPostAjax(url, returnMethod);
}
*/
/*
function updateTheme()
{
	var returnMethod = function(xhr)
	{
		if (xhr.readyState === 4) 
		{
			if (xhr.status === 401)
			{
				logout();
			}
			else if (xhr.status === 200) 
			{
			  console.log(xhr.responseText);
			} else {
			  //console.error(xhr.responseText);
			}
		}
	};
	
	var url = "notes.php?themeMode=" + themeMode.value;
	
	asyncPostAjax(url, returnMethod);
}
*/
function getAllNotes()
{
	var returnMethod = function(xhr)
	{
		if (xhr.readyState === 4) 
		{
			if (xhr.status === 401)
			{
				logout();
			}
			else if (xhr.status === 200) 
			{
			  //console.log(xhr.responseText);
			  if (xhr.responseText)
			  {
				  var jsonData = JSON.parse(xhr.responseText);

				  for (var i = 0; i < jsonData.length; i++)
				  {
					var newNote = new notesModel(jsonData[i]);
					createNote(newNote);
					noteData.push(newNote);
				  }
			  }
			} 
			else 
			{
			  //console.error(xhr.responseText);
			}
		}
	};
	
	var url = "notes.php?allNotes=true";
	
	asyncPostAjax(url, returnMethod);
}

function getNoteData(noteId)
{
	if (noteId)
	{
		for (var i = 0; i < noteData.length; i++)
		{
			if (noteData[i].id == noteId)
			{
				return noteData[i];
			}
		}
	}
	return;
}

function editNote(event)
{
	if (event.srcElement.hasAttribute("noteid"))
	{
		var noteId = event.srcElement.getAttribute("noteid");
		stickieNoteId = noteId;

		var stickieNote = document.getElementById("stickie" + stickieNoteId);

		reorderNotes(stickieNote);

		var noteContents = document.createElement("TEXTAREA");
		var contents = document.getElementById("contents" + stickieNoteId);

		noteContents.innerText = contents.innerHTML;
		noteContents.id = "noteContents";
		noteContents.className = "noteContents";
		
		noteContents.addEventListener("blur", updateNoteContents);
		
		contents.innerHTML = "";
		contents.appendChild(noteContents);
		
		resizeContents(noteContents, stickieNote);
		noteContents.focus();
	}
}

function resizeContents(noteContents, stickieNote)
{
	var boundingRectangle = stickieNote.getBoundingClientRect();
	
	noteContents.style.width = (boundingRectangle.width - 30) + "px";
	noteContents.style.height = (boundingRectangle.height - 50) + "px";
}

function updateNoteContents(event)
{
	var newNoteContents = event.srcElement;
	
	if (newNoteContents)
	{
		var updatedNote = newNoteContents.parentElement;
		var stickieNoteData = getNoteData(updatedNote.getAttribute("noteid"));
		var contents = document.getElementById("contents" + stickieNoteData.id);
		
		stickieNoteData.contents = newNoteContents.value;
		contents.removeChild(newNoteContents);
		contents.innerHTML = newNoteContents.value;
		
		saveNote(false, stickieNoteData);
	}
}

function reorderNotes(stickieNote)
{
	removeNoteChanges();
	
	var stickieNoteData = getNoteData(stickieNote.getAttribute("noteid"));
	
	if (stickieNoteData)
	{
		var newLayer = stickieNoteData.layer;
		
		for (var i = 0; i < noteData.length; i++)
		{
			if (stickieNoteData.layer < noteData[i].layer)
			{
				if (newLayer < noteData[i].layer)
				{
					newLayer = noteData[i].layer;
				}

				noteData[i].layer = noteData[i].layer - 1;
				document.getElementById("stickie" + noteData[i].id).style.zIndex = noteData[i].layer;
				saveNote(false, noteData[i]);
			}
		}
		
		stickieNote.style.zIndex = newLayer;
		stickieNoteData.layer = newLayer;
		saveNote(false, stickieNoteData);
	}
}

function showInstructions()
{
	var instructionsText = "This is a fairly simple app that's designed to allow you to keep " +
		"track of basic notes, as if they are sticky notes." +
		"<br /><br />" +
		"Click on the <img src='./images/addnote.svg' class='exampleButton' /> " +
		" icon to create a note or the " +
		"<img src='./images/close.svg' class='exampleButton' /> icon to logout." +
		"<br /><br />" +
		"Once you have a note displayed, there are 4 more icons displayed.  " +
		"<br /><br />" +
		"The upper left corner has the move icon <img src='./images/move.svg' class='exampleButton' />. " +
		"Click and drag that icon to reposition your note." +
		"<br /><br />" +
		"The lower right corner icon <img src='./images/resize.svg' class='exampleButton' /> " +
		" allows you to resize the icon by clicking and dragging the icon. " +
		"<br /><br />" +
		"The lower left corner icon <img src='./images/addimage.svg' class='exampleButton' /> " +
		" allows you to upload a single image that will be displayed " +
		"at the bottom of your note. " +
		"<br /><br />" +
		"The upper right corner icon is a menu icon <img src='./images/hamburger.svg' class='exampleButton' />, " +
		"allowing you to change the color of the note or to delete the note. " +
		"<br /><br />" +
		"This is not a secure site, so you should not put anything in the notes that you " +
		"want to keep secure. " +
		"<br /><br />" +
		"Also, this is just a test of some code that I wrote, so there may be bugs.  Please " +
		"report bugs to <a href ='mailto:sales@ericsgear.com'>sales@ericsgear.com</a>.  " +
		"I may come back and fix the bugs, but since " +
		"this is just a test, maybe not. " +
		"<br /><br />" +
		"If you like this app and want me to continue development or to create a mobile " +
		"version, also let me know at <a href ='mailto:sales@ericsgear.com'>sales@ericsgear.com</a>. " +
		"<br /><br />" +
		"Click anywhere on this page to close these instructions.";
	
	var mask = document.createElement("DIV");
	var instructionsDiv = document.createElement("DIV");
	
	mask.id = "mask";
	instructionsDiv.id = "instructionsDiv";
	
	instructionsDiv.innerHTML = instructionsText;
	mask.appendChild(instructionsDiv);
	
	mask.addEventListener("click", closeInstructions);

	document.body.appendChild(mask);
}

function closeInstructions()
{
	var mask = document.getElementById("mask");
	document.body.removeChild(mask);
}
