#Course Diary - UP810066

###Foreword:

This application has been developed for lecturers to be able to plan and structure their units. It is capable of adding units, adding sessions, ordering the sessions in a user friendly fashion, being able to edit and remove sessions, and being able to search through the sessions. All of this data is stored and can be accessed whenever the user accesses the application.

###Using the application:

1. To start the application, type: "npm run initsql" to start the database, password = "root", and "npm run dashboard" to start the website.

2. The user can add a unit to the initially empty unit list by typing the name into the add unit text field and then by clicking the add unit button. This will not allow entry of empty strings or duplicates.

3. The user can then add a session to the unit by entering values into the entry fields between the horizontal lines, note, the homework and date fields are not required to have values as a user may not wish to give homework and the date may not already have been identified. The rest, however, must be given a value, or the area the entry fields are in will turn red.

4. Once all the desired data has been entered, the user may search through all of the sessions from every unit using the search bar, the search bar does not require a button to be pressed and will search whenever a value has been entered. The search bar must be emptied to continue to use the unit view though.

5. If the users wishes to change what they have written for a given session, they may enter a different value, then click edit. For example: if the user wishes to change a session from week 1 to week 3, changing 1 to 3 in the field will change its value and reorder the table so that the week is now in the right place, the reordering is useful as lecturers frequently change which week they teach certain things on.

###Design decisions:

Ordered sessions by week and then by lecture type as often there will be more lectures than practicals
and I believe it would help the user to have the lectures at the top as lots of practicals are similar in content.

Chose not to limit the number of lectures per week as classes such as ADPROC have multiple lectures.

Decided to user console.log("Function name called"); on every function to trace through the code easier;
this is useful for identifying where code is failing.

Searching was made with usability in mind, I didn't want the user to have to keep moving the mouse to click a button every time they wanted to change their search term. The trade-off here being that the user must manually delete their entry to return to the unit view, whereas a button could just empty the search bar automatically.

###Limitations:

This application has **no security**, an attempt was made to implement google authentication, however, I could not get it to work within the amount of time given. This should be addressed in the future of this application, as realistically it renders the software unusable for critical data. However, the lack of security presents the opportunity of the users being able to easily share their data with their colleagues, which will be useful as many lecturers work together frequently. This is an unbalanced trade-off though and steps should be taken in the future to achieve both.

This application has **extremely limited accessibility**. Text to speech for blind people needs implementing, speech to text should also be implemented for people with physical disabilities. The only design regarding accessibility that has really been implemented is that each row has an alternating colour which could help people with poor vision remain working on the same line.

This application is not suitable for teams larger than departments, and in its current form, for teams other than Software Engineering course leaders. In regards to its current form, it is limited by the fact that the only coordinator values in the combobox are those of the SE coordinators, this can be worked around by editing the name for each session after the session has been made, but realistically a more robust solution is required, such as having the list of coordinators be based upon usernames. With regards to departments, the search function returns sessions from all units, I believed that this would be useful as on a smaller scale, a coordinator may appreciate being able to see what is being taught in other units that may benefit students in the unit they are currently working on, due to the overlapping nature of the course, they may also want to see all sessions that they are teaching on a given week. However, the search function is not comprehensive, it can only search for one string at a time, therefore, if this system were to be deployed on a larger scale, the search function would return so many irrelevant sessions that it would become unusable.

###Future expansions:

Future features that I would like to see implemented are:

* Security - There needs to be some for of authentication and authorization code implemented to make this system usable. This should also allow collaboration, perhaps by sharing a code which allows access to someone else's units.

* Grouping - The ability to group sessions together and edit parts such as weeks so that they either all move the same number of weeks or that they all move to the same week, this could be determined in the UI. The ability to implement grouping of the as yet unbuilt user system could be useful so that certain data could be shared to all users of a department, other members could have read but no write access for other department members' units, searching could then be limited to a department.

* Comprehensive Searching - Being able to use more search terms, this could perhaps be implemented by having a .split and then the search iterates over the list of search terms returning all of them.

* Drag and Drop Capability - This could be useful for users with a mouse for easier restructuring of the sessions.

* Speech Recognition - The ability for the user to be able to input data through speech would be really useful in my opinion as the user may have physical limitations, this could also help prevent the user from developing RSI from overtyping.

###Software used:

* ITerm2 - Terminal replacement. Used to ssh into the vm and launch the database and webserver, as well as receive console.logs from the webserver.

* Filezilla - WinSCP alternative. Used to transfer files from local machine to the virtual machine through the sftp protocol.

* Visual Studio Code - Text editor. Used to write and edit the codebase, works very well after installing plugins for JavaScript, Node.js and MySQL.

* Firefox & Chrome - Browsers. Used for testing the website on.

###Reflection

I have gained a lot of knowledge from developing this website, we have been taught how to understand and code sql in other modules, we have been shown how to implement sql in this module, but actually implementing the database has really shown me how complex it can be. I've had to use strange queries to perform tasks which I've later realised could be solved much more easily on the client side, such as trying to delete using "LIMIT", which required me to chain delete and select queries, however, I've learnt how to use limit due to this mistake. I've tried to implement google authentication, which briefly worked and then started returning error 400s, which has taught me when you need to let go of functionality in order to reach your deadlines. I've implemented a front end, a client, a server, a database access layer, a database, and I've learnt how they operate. How the client retrieves the data from the user, how it sends it to the server, how the server handles it and passes it to the database.