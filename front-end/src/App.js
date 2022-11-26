import logo from './logo.svg';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Library from './library.js';

function App() {
  const [library, setLibrary] = useState([]);
  const [error, setError] = useState("");
  const [book, setBook] = useState("");
  const [author, setAuthor] = useState("");
  const [ISBN, setISBN] = useState("");
  const [published, setPublished] = useState("");
  
    const fetchLibrary = async() => {
    try {      
      const response = await axios.get("/apl/liber");
      setLibrary(response.data.books);
      //console.log(response.data.books);
    } catch(error) {
      setError("error retrieving library: " + error);
    }
  }
  
    useEffect(() => {
    fetchLibrary();
    
  }, []);
  
  const createNewBook = async() => {
    console.log("creating");
    try {
      await axios.post("/apl/liber", {title: book, creator: author, ISBN: ISBN, published: published});
    } catch(error) {
      setError("error adding a book: " + error);
    }
  }
  
    const addBook = async(e) => {
    e.preventDefault();
    console.log("awaiting");
    await createNewBook();
    closeForm();
    fetchLibrary();
    setBook("");
    setAuthor("");
    setISBN("");
    setPublished("");
    
  }
  
  const openForm = () => {
    document.getElementById("myForm").style.display = "block";
  }
 
  const closeForm = () => {
    document.getElementById("myForm").style.display = "none";
  }
  
  return (
    <div className="App">
      <div className="Head">
        <h1>PYEbrary</h1>
        <p>Virtual Library</p>
      </div>
      <div className="Body">
      {error}
      <p className="introtext">This is the Pye "Virtual Library," or "Pyebrary" for short. For logical purposes, please pretend there is an api retrieving extra data like synopses or cover images from an API (There were no good free ones)
      and that the book contents are minted to the blockchain or some bs like that. I'm honestly too tired for anything else.</p>
      <div className="BooklistHeader">
        <h1>Book List</h1>
        <button onClick={e => fetchLibrary()}><h4>Refresh</h4></button>
        <button onClick={e => openForm()}><h4>Add new</h4></button>

      </div>
      
        {library.map( insert => (Library(insert) ))}
        
        <div class="form-popup" id="myForm">
          <form action="/action_page.php" class="form-container" onSubmit={addBook}>
            <h1>Enter New Book</h1>
            <label for="name"><b>Name*</b></label>
            <input type="text" placeholder="Enter Book Name" name="name" value={book} onChange={e => setBook(e.target.value)} required/>
            <label for="author"><b>Author*</b></label>
            <input type="text" placeholder="Enter Book Author" name="author" value={author} onChange={e => setAuthor(e.target.value)} required/>
            <label for="published"><b>Date (MM/DD/YYYY)</b></label>
            <input type="text" placeholder="Enter Publishing Date" name="published" value={published} onChange={e => setPublished(e.target.value)}/>
            <label for="isbn"><b>ISBN</b></label>
            <input type="text" placeholder="Enter ISBN" name="isbn" value={ISBN} onChange={e => setISBN(e.target.value)}/>
            <h6>* Required Field</h6>
            <button type="submit" class="btn">Submit</button>
            <button type="button" class="btn cancel" onClick={e => closeForm()}>Cancel</button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default App;
