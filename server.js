// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////
const db = require('./models')
//require express in our app
var express = require('express'),
  bodyParser = require('body-parser');

// generate a new express app and call it 'app'
var app = express(); 

// serve static files in public
app.use(express.static('public'));
app.use(express.json())
// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));



////////////////////
//  DATA
///////////////////









////////////////////
//  ROUTES
///////////////////




// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('/views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find()
    .populate('author')
    .exec(function(err, books){
    if (err) {
      console.log("index error: " + err);
      res.sendStatus(500);
    } else{
    
    res.json(books);
  }});
});

// get one book
app.get('/api/books/:id', function (req, res) {
  // find one book by its id
  db.Book.findById(req.params.id)
  .populate('author')
  .exec(function(err, book){
    if(err){
      console.log("index error: " + err);
      res.sendStatus(500);
    }
    res.json(book)
  })
  
});

app.get('/api/authors', (req, res) => {
  db.Author.find({}, (err, authors) => {
    res.json(authors);
  })
})

// create new book
 app.post('/api/books', function (req, res) {
   console.log(req.body);
      // create new book with form data (`req.body`)
      var newBook = new db.Book({
        title: req.body.title,
        image: req.body.image,
        releaseDate: req.body.releaseDate,
      });

      // this code will only add an author to a book if the author already exists
      db.Author.findOne({name: req.body.author.name}, function(err, author){
        console.log(author);
        newBook.author = author;
        // add newBook to database
        newBook.save(function(err, book){
          if (err) {
            console.log("create error: " + err);
          }
          console.log("created ", book.title);
          res.json(book);
        });
      });

    });

// update book
app.put('/api/books/:id', function(req,res){
// get book id from url params (`req.params`)

  console.log('books update', req.params);
  db.Book.findByIdAndUpdate(req.params.id, req.body, {new: true},(err, newBook) => {
    if(err) {return console.log(err)
    }
    
      res.json(newBook)
  })
})

// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  console.log('books delete', req.params);
  var bookId = req.params.id;
  db.Book.findOneAndDelete(
    { _id: bookId },
    (err, deletedBook) => {
      deletedBook.delete()
      console.log(deletedBook);
        if(err) { return console.log(err) }
        res.json(deletedBook);
});
  
});





app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
});
