# NoteTaker
In looking for a job, I saw a position that wanted an example of some work for them to look over as a test for employment.  They wanted either a simple image upload/preview page, or as more of a challenge, a note taking site that had some basic requirements.  Included in those requirements is that the notes looked like rectanges with a list of various colors a user could select.

Since I'm never content to do just what's asked, I decided to write a web app that created notes like Stickie notes, can be moved around the screen, can be rezised, change the note color, add images (with a preview opton), delete the notes, has a login, and has a database to store all of that for more than a single instance use.

This repo is that app.  I wrote it using PHP 5.6 and MySQL 5.5, with HTML, CSS, and JavaScript.  I've included the SQL to create the DB, and I didn't use any JavaScript libraries.  I hand coded everything except the database, and used a basic editor (Notepad++).  I could have used WebStorm or Visual Studio, but I wanted t okeep it simple.  It turned out more complex than I initially expected, but that happens.

I also could have written this in C#, but my hosting service is Linux based.  And yes, this is available for testing at http://intensecomputers.com/notetaker/login.html.  I could have compiled the C# for Linux, but that isn't something I've done before.  I may end up rewriting this app in C#, but that would have to be a different repo.

There are other projects that I want to do, so I cut out some of the more superfluous functionality.  If I get lots of interest for this app from users, I'll see about adding those features back in.  Also, this is not a secure site, as I only used MD5 encryption (with hash) for the password.  I don't have an SSL on my hosting account, so don't use any information you want kept safe.

If you like the app or want to use the code, send me an email at computercarguy@gmail.com.
