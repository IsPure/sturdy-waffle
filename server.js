//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const Recipe = require('./models/schema.js');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()


//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
// *******************************************
// *************INDEX ROUTING*****************
// *******************************************
app.get('/', (req, res) => {
  res.redirect(
    '/bread'
  )
});

app.get('/bread', (req, res) => {
  Recipe.find({}, (err, allRecipes) => {
    res.render(
      'index.ejs',
      {
        recipe:allRecipes
      
      }
    )
  })
});

// *******************************************
// ************NEW/CREATE ROUTING*************
// *******************************************
app.get('/bread/new', (req, res) => {
  res.render('new.ejs')
});

app.post('/bread', (req, res) => {
  if(req.body.dairyFree === 'on'){
    req.body.dairyFree = true;
} else {
    req.body.dairyFree = false;
};
  if(req.body.glutenFree === 'on'){
    req.body.glutenFree = true;
  } else {
    req.body.glutenFree = false;
  };
  Recipe.create(req.body, (error, createdRecipe) => {
     res.redirect('/bread')
    })
 });

// *******************************************
// ***************SHOW ROUTING****************
// *******************************************
app.get('/bread/:id', (req, res) => {
  Recipe.findById(req.params.id, (error, foundRecipe) => {
  res.render(
      'show.ejs',
      {
      recipe:foundRecipe   
      } 
    )
  })
});

// *******************************************
// ************EDIT/UPDATE ROUTING*************
// *******************************************
app.get('/bread/:id/edit', (req, res)=>{
  Recipe.findById(req.params.id, (err, foundRecipe)=>{ 
      res.render(
      'edit.ejs',
      {
        recipe: foundRecipe
      }
    );
  
  });
});

app.put('/bread/:id', (req, res)=>{
  if(req.body.dairyFree === 'on'){
    req.body.dairyFree = true;
} else {
    req.body.dairyFree = false;
};
  if(req.body.glutenFree === 'on'){
    req.body.glutenFree = true;
  } else {
    req.body.glutenFree = false;
  };
  Recipe.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel)=>{
      res.redirect('/bread');
  });
});

// *******************************************
// ************DELETE ROUTING*****************
// *******************************************
app.delete('/bread/:id', (req, res) => {
  Recipe.findByIdAndRemove(req.params.id, (error, data) => {
  res.redirect('/bread');
  })
});

//localhost:3000
app.get('/bread' , (req, res) => {
  res.send('Hello World!');
});

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));


