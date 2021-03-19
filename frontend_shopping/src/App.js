import './App.css';
import {useState,useEffect} from 'react';

const URL = 'http://localhost/backend_shoppinglist/';

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');

  let status = 0;
  useEffect(() => {
    fetch(URL + 'retrieve.php')
      .then(response => {
        status = parseInt(response.status);
        return response.json();
      })
      .then(
        (response) => {
          if (status === 200) {
            setItems(response);
          } else {
            alert(response.error);
          }

        }, (error) => {
          alert(error);
        }
      )
  }, [])

  function add(e) {
    e.preventDefault();
    let status = 0;
    fetch(URL + 'add.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        description: item,
        amount: amount
      })
    })
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            setItems(items => [...items, res]);
            setItem('');
            setAmount('');
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
  }

  function remove(id) {
    let status = 0;
    fetch(URL + 'delete.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    })
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            const newListWithoutRemoved = items.filter((item) => item.id !== id);
            setItems(newListWithoutRemoved);
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
  }
  return (
    <div className="container-fluid">
      <h3 className="text-center">OstosLista</h3>
      <pre></pre>
      <div className="row">
        <form className="" onSubmit={add}>
          <label className="col form-label">Uusi tuote:</label>
          <input className="form-control-inline col" placeholder="Syötä tuote:" value={item} onChange={e => setItem(e.target.value)} />
          <input className="form-control-inline col" placeholder="Syötä määrä:" value={amount} onChange={e => setAmount(e.target.value)} />
          <button className="btn nappi">Lisää listaan:</button>
        </form>
      </div>
      <pre></pre>
      <ul>
        {items.map(item => (
          <li className="row" key={item.id}>
            <span className="col">{item.description}</span>
            <span className="col">{item.amount}</span>
            <a className="col" onClick={() => remove(item.id)} href="#">Delete</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;