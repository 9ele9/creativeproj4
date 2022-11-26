import axios from 'axios';
import {errorGet} from './error.js';
export default function Library(props){
    let keyD = props.libID;
    console.log(keyD);
    const thing = () => {
        alert("thing");
    }
    const stuff = () => {
        alert("stuff");
    }
    
        const minusItem = async() => {
            //alert("DELETE! DELETE! DELETE!");
            try {
                await axios.delete(`/apl/liber/${props.libID}`);
                //updateCart();
            } catch(error) {
                errorGet(error);
            } 
        } 
  
  const openOther = () => {
    document.getElementById(keyD).style.display = "block";
  }
 
  const closeOther = () => {
    document.getElementById(keyD).style.display = "none";
  }

    return <div key={props.libID}>
    {props.title} by {props.creator} 
    <button onClick={e => minusItem()}>Delete</button>
    <button onClick={e => openOther()}>Other info</button>

    <div class="form-popup" id={keyD}>
    <p>Media Type: {props.mediaType}</p>
    <p>ISBN: {props.ISBN}</p>
    <p>Published: {props.published}</p>
    <button type="button" class="btn cancel" onClick={e => closeOther()}>Close</button>
    </div>
    </div>
}