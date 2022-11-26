/* global Schema */
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const crypto = require("node:crypto");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const HistorySchema = new mongoose.Schema({ 
      book: String,
      name: String, 
      dateWithdrawn: String, 
      dateReturned: String
});

const History = mongoose.model('History', HistorySchema);
      
const ReviewSchema = new mongoose.Schema({ 
      book: String,
      name: String, 
      review: String, 
      dateleft: String
});

const Reviews = mongoose.model('Reviews', ReviewSchema);

const BookSchema = new mongoose.Schema({
  mediaType: String,
  libID: String,
  title: String, 
  creator: String, 
  otherContribs: String, 
  published: String, 
  ISBN: String, 
  volNum: String, 
  genres: Array
});

const Book = mongoose.model('Book', BookSchema);
/*Book.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });*/

const dickenshist = new History({ 
      book: "A Tale of Two Cities",
      name : "CEO of Books", 
      dateWithdrawn : "January 1st, 1970", 
      dateReturned : "January 1st, 1970" 
});

const dickens = new Book({
  mediaType: "Book", 
  libID: 1,
  title: "A Tale of Two Cities",
  creator: "Charles Dickens", 
  otherContribs: "", 
  published: "1859", 
  ISBN: "9780451530578", 
  volNum: "", 
  genres: ["Historical", "Fiction"],
});

const dickensreview = new Reviews({ 
      book: "A Tale of Two Cities",
      name : "CEO of Books", 
      review: "Fantastic book! What more needs to be said!", 
      dateleft: "January 1st, 1970"
});

app.get('/apl/liber', async (req, res) => {
  console.log("get library");
  try {
    let booklist = await Book.find();
    res.send({books: booklist});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/apl/liber/:id', async (req, res) => {
  console.log("get library with id");
  try {
    let booklist = await Book.find( { libID: req.params.id } );
    res.send({books: booklist});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/apl/liber', async (req, res) => {
  console.log("post new work");
  const uuid = crypto.randomUUID();
  console.log("Type of: " + uuid + ": " + typeof(uuid));
  
    const newBook = new Book({
    mediaType: "Book",
    libID: uuid,
    title: req.body.title, 
    creator: req.body.creator, 
    otherContribs: req.body.otherContribs, 
    published: req.body.published, 
    ISBN: req.body.ISBN,
    genres: req.body.genre,
  });
  try {
    await newBook.save();
    res.send({books: newBook});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/apl/liber/:id', async (req, res) => {
  console.log("In delete");
  try {
    await Book.deleteOne( { libID: req.params.id } );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/apl/review', async (req, res) => {
  console.log("get reviews");
  try {
    let allReviews = await Reviews.find();
    res.send({reviews: allReviews});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  console.log("thingy");
});

app.get('/apl/review/:id', async (req, res) => {
  console.log("get review with id");
  try {
    //console.log(req.params.id);
    let workFind = await Book.find( { libID: req.params.id } );
    //console.log(workFind[0].title);
    let oneReview = await Reviews.find( { book: workFind[0].title } )
    //console.log("Review: \n" + oneReview[0].review);
    res.send({reviews: oneReview});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  
});

app.delete('/apl/review/:id', async (req, res) => {
  console.log("delete review with id");
  try {
    let workFind = await Book.find( { libID: req.params.id } );
    await Reviews.deleteOne( { book: workFind[0].title } );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});



async function work() {
 /* await dickens.save();
  await dickenshist.save();
  await dickensreview.save()*/
  console.log('Oh great heavens');
  let readintime = await Book.find();
  let bookhistory = await History.find();
  let reviewing = await Reviews.find();
  console.log(readintime);
  console.log(bookhistory);
  console.log(reviewing);
}



//work();

app.listen(3001, () => console.log('Server listening on port 3001!'));

/*Book.deleteMany({ mediaType : "Book" }).then(function(){
    console.log("Data deleted"); // Success
}).catch(function(error){
    console.log(error); // Failure
});

History.deleteMany({ name : "CEO of Books" }).then(function(){
    console.log("Data deleted"); // Success
}).catch(function(error){
    console.log(error); // Failure
});

Reviews.deleteMany({ name : "CEO of Books" }).then(function(){
    console.log("Data deleted"); // Success
}).catch(function(error){
    console.log(error); // Failure
});
*/