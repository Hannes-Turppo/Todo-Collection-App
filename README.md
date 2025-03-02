Navigate into the project's root directory and run the following commands to set up your environment:

Install:
"npm install"

Make sure you have a local MongoDB server running on your system and  open client and run in separate consoles:

run server:
"npm run dev:server"
run client:
"npm run dev:client"

The server runs on port 8080 by default and client runs on port 3000.
To start using the app locally, open "http://127.0.0.1:3000" in your browser.


Declaration of AI usage:

Github Copilot chat with Claude 3.7 was used for debugging and finding ideas for implementation.
At no point have I inserted AI generateed code into this project.


Technology choises

This project is written entirely in typescript to make work easy between frontend and backend.
The server is implemented with NodeJS and express routing and for data storage the server uses MongoDB running locally.
For connectivity with the DB the server uses Mongoose, which offers easy query solutions for creating, updating, getting and deleting items.
The backend constructs the relevant data into a format, which is easy to handle in the client.

The frontend runs on typescript React built with Vite. User interface is built with MaterialUI components and the app uses React-Router.
MUI components with React offer an easy plug-and-play experience for creating responsive and relatively good looking web applications, and
thus it was my choice. It didn't hurt to already be somewhat familiar with it. I chose it over TailwindCSS because of the ready modules and 
easy setup compared to Tailwind.

These technologies were chosen, because of their familiarity to me and their adaptability to the project as instruced.


User manual:

To start using the app, navigate to "http://127.0.0.1:3000" or "localhost:3000". Here you have options to navigate to register or if you have 
a registered account, you can go to the login page. After you register you will be redirected to the login page and after a succesfull login, 
the user is taken to the main board at "/".

In the board the user can create collections, that are used to house the users articles.The user can set a title for the collection and choose
a color.

User can add and delete articles in the board. These articles have a title and content text and the user can also add a due time as text to the 
article and write down how much time they have spent on the item. The user can select a color, which will be displayed as the header background 
color. Articles have an automatically updating timestamp displaying the time the article was last updated. User can add and delete comments in 
the article and comments can have a color.

Collections and articles can be edited either trough the menu or by doubleclicking on them. In editing, users can change all text values and 
change color of the element.

User can use the search box to look for articles that have the search keyword in either the title or content. Sadly these articles are not 
movable so you might want to think, where you place them.


Point suggestions:

- Basic features and documentation: 25p
- The cards are not movable: -2p
- Utilization of frameworks: 3p (using react with MaterialUI)
- user can set the color for cards, collections and comments: 2p
- software is accessibility: 3p (can be used with only keyboard)
- search filter: 3p (user can filter articles with search)
- double click edit: 4p
- articles can have comments: 3p
- articles and comments have timestamps: 4p
- articles have estimated time: 1p
- user can mark spent time: 1p
- total: 47p
