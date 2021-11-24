import React, {useState} from "react"
import { Link, useRouteMatch } from "react-router-dom"
import Plot from "react-plotly.js"
import axios from 'axios'

// const useStateWithLocalStorage = localStorageKey => {
//   const [value, setValue] = React.useState(
//     localStorage.getItem(localStorageKey) || false
//   )
//   React.useEffect(() => {
//     localStorage.setItem(localStorageKey, value)
//   }, [value])

//   return [value, setValue];
// }

const Client = ({clients}) =>{

    // const [on, setOn] = useStateWithLocalStorage()
    const [on, setOn] = useState(false)
    const [demand, setDemand] = useState('')

    const showWhenOff = { display: on ? 'none' : ''}
    const showWhenOn = { display: on ? '' : 'none'}

    const match = useRouteMatch('/client/:id')
    let client = match
    ? clients.find(client=>client.id === match.params.id)
    : null


    const turnOff = () =>{
      if (!client.TurnOff){
      const request = axios.post(`http://127.0.0.1:5000/turnOff/${client.id}`, {}).then((data)=>{
        console.log(data)
        setOn(!on)
      })}
      else {
        const request = axios.post(`http://127.0.0.1:5000/turnOn/${client.id}`, {}).then(data=>{
          console.log(data)
          setOn(!on)
        })
      }
    }

    const handleDemandChange = (event) =>{
      setDemand(event.target.value)
    }


    const changeDemand = (event) =>{
      event.preventDefault()
      const request = axios.post(`http://127.0.0.1:5000/changeDemand/${client.id}`, {'demand': demand}).then((data)=>{
        console.log(data)
        setDemand('')
      })
    }

    let valuePm, valuePe, valuePn, valueE
  
  
    if(!client){
        client=''
    }

    try{
      valuePm=client.Pm.at(-1).toPrecision(3)
      valuePe=client.Pe.at(-1).toPrecision(3)
      valuePn=client.parameter.Pn
      valueE=client.parameter.Efficiency *100
    }
    catch{
      valuePm=valuePe=valuePn=valueE=0
    }
    let demandLine=[]
    for(let i=0; i<10; i++){
      demandLine.push(client.demand/1000)
    }

    return(
    <div>
      <h1>{client.name}</h1>
      <Plot
        data={[
          {
            x: client.time,
            y: client.speed,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'blue'},
          },
          {type: 'bar', x: client.time, y: client.speed},
        ]}
        layout={{width: 600, height: 400, title: 'Wind Speed',
        xaxis:{title: 'time [s]'},
        yaxis:{title: 'speed [m/s]', range: [0,20]},
        showlegend: false 
      }}
      />
      <Plot
        data={[
          {
            x: client.time,
            y: demandLine,
            type: 'sline',
            mode: 'lines+markers',
            marker: {color: 'black'},
            name: 'Demand'
          },
          {type: 'bar', x: client.time, y: client.Pe, name: 'Total'},
        ]}
        layout={{width: 1200, height: 400, title: 'Electrical Power',
        xaxis:{title: 'time [s]'},
        yaxis:{title: 'Pe [kW]', range: [0,200]} 
      }}
      />
      <table id='table_parameters'>
        <tbody>
        <tr>
          <td>Rated Power</td>
          <td>Generator efficiency</td>
          <td>Mechanical Power</td>
          <td>Electrical Power</td>
        </tr>
        <tr>
          <td>{valuePn} kW</td>
          <td>{valueE} %</td>
          <td>{valuePm} kW</td>
          <td>{valuePe} kW</td>
        </tr>
        </tbody>
      </table>
        <div style={showWhenOff}>
          <button className='turnOff_button' onClick={turnOff}>Turn Off Client</button>
        </div>
        <div style={showWhenOn}>
          <button className='turnOff_button' onClick={turnOff}>Turn On Client</button>
        </div>
        <form onSubmit={changeDemand}>
          <input className='demand_input' value={demand} onChange={handleDemandChange}/>
          <button className='demand_button' type='submit'>Save demand</button>
        </form>
        <Link id='Link' to='/'>Back to Home Page</Link>
    </div>
    )
}
export default Client