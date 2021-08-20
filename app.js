const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
const port = 3000;

// reading data from json file
let jsonUsersData = fs.readFileSync(`${__dirname}/json_data/user.json`);
jsUsersData = JSON.parse(jsonUsersData);

let flag = 0;

// setting up view engine
app.set('view engine', 'ejs');

// handle invalid routes
// app.use((req, res, next) => {
//   res.status(404).send('ERROR! Page Not Found!');
// });

// to get data from the html page
app.use(express.urlencoded());
app.use(express.json());

// route for sign up
app.get('/create', (req, res) => res.sendFile(`${__dirname}/index.html`));

// route for adding new user
app.post('/checkCreate', (req, res) => {
  jsUsersData.forEach((user) => {
    if (user.username == req.body.username) {
      flag = 1;
      // res.end('User already exist!');
      throw new Error('User already exist!');
    }
  });
  if (flag == 0) {
    const newUser = {
      username: req.body.username,
      password: req.body.password,
      notes: [],
    };

    jsUsersData.push(newUser);
    const jsonUsers = JSON.stringify(jsUsersData);
    fs.writeFile(`${__dirname}/json_data/user.json`, jsonUsers, (err) => {
      if (err) {
        return console.log(err);
      }
    });

    res.sendFile(`${__dirname}/login.html`);
  }
  flag = 0;
});

// route for login page
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/login.html`);
});

// route for checking login details
app.post('/checkLogin', (req, res) => {
  jsUsersData.forEach((user) => {
    if (user.username == req.body.username && user.password == req.body.password) {
      flag = 1;
      const data = { username: req.body.username, notes: user.notes };
      res.render('home', { data: data });
    }
  });
  if (flag == 0) {
    // res.end('Wrong username or password');
    throw new Error('Wrong username or password');
  }
  flag = 0;
});

// route to add note
app.post('/addNote/id/:username', (req, res) => {
  // console.log(req.params.username);
  jsUsersData.forEach((user) => {
    if (user.username == req.params.username) {
      user.notes.push(req.body.mynote);
      const data = { username: req.params.username, notes: user.notes };
      res.render('home', { data: data });
    }
  });
  const jsonUsers = JSON.stringify(jsUsersData);
  fs.writeFile(`${__dirname}/json_data/user.json`, jsonUsers, (err) => {
    if (err) {
      return console.log(err);
    }
  });
});

// route to logout

app.get('/logout', (req, res) => {
  res.sendFile(`${__dirname}/login.html`);
});

app.listen(port, () => console.log(`Example app listening on port 3000!`));
