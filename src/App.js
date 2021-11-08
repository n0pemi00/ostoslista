import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'http://localhost/ostoslistabackend/';

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");

  function Save(e){
    e.preventDefault();
    const json = JSON.stringify({description:text, amount:amount})
    axios.post(URL + 'add.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      setItems(items => [...items,response.data]);
      setText('');
      setAmount('');
    }).catch (error => {
      alert(error.response.data.error)
    });
  }

  function remove (id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems (newListWithoutRemoved);
      }).catch (error => {
        alert(error.response ? error.response.data.error : error);
      });
  }

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data);
      }).catch(error => {
        alert(error);
      })
  }, [])

  return (
    <div className="container">
      <h3>Shopping list</h3>
      <form onSubmit={Save}>
        <label>New item</label>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Type description"></input>
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Type amount"></input>
       <button>Add</button>
      </form>

      <ol>
        {items?.map(text => (
         <li key={text.id}>
          {text.description},{text.amount}&nbsp;
          <a href="#" className="delete" onClick={() => remove(text.id)}>Delete</a>
         </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
