import axios from 'axios'
import { useState, useEffect } from 'react'
import './App.css';
import Home from './components/Home'
import Client from './components/Client'
import { Switch, Route, useRouteMatch} from "react-router-dom"



function App() {
  const [currentClients, setCurrentClients] = useState(0)
  const [clients, setClients]=useState([])
  const [time,setTime]=useState([])
  const [speed,setSpeed]=useState([])
  const [pe, setPe]=useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload()
    }, 10000)
    return () => clearInterval(interval);
 }, []);


  useEffect(() => {
    const getClientes = async ()=>{
    let response = await axios.get('http://127.0.0.1:5000/clients',{
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    setCurrentClients(response.data.clients_counter)
    setClients(response.data.clients)
    setPe(response.data.Sum_Pe)
  }
  getClientes()
  }, [])

  useEffect(() => {
    const getSpeed = async () =>{
    let response = await axios.get('http://127.0.0.1:5000/time',{
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    setTime(response.data.time)
    setSpeed(response.data.speed)
  }
  getSpeed()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <Switch>
          <Route path='/client/:id'>
            <Client time={time} clients={clients}/>
          </Route>
          <Route path='/'>
            <Home speed={speed} time={time} clients={clients} currentClient={currentClients} pe={pe}/>
          </Route>
        </Switch>
      </header>
    </div>
  );
}

export default App;
