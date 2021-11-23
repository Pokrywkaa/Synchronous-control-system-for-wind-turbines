import React, {useState, useEffect} from "react"
import { Link, useRouteMatch } from "react-router-dom"
import Plot from "react-plotly.js"
import axios from 'axios'

const Client = ({clients}) =>{

    const match = useRouteMatch('/client/:id')
    let client = match
    ? clients.find(client=>client.id === match.params.id)
    : null


    const turnOff = () =>{
      if (!client.TurnOff){
      const request = axios.post(`http://127.0.0.1:5000/turnOff/${client.id}`, {}).then((data)=>{
        console.log(data)
      })
    }
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
    let demand=[]
    for(let i=0; i<9; i++){
      demand.push(client.demand/1000)
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
        yaxis:{title: 'speed [m/s]', range: [0,20]} 
      }}
      />
      <Plot
        data={[
          {
            x: client.time,
            y: demand,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'black'},
          },
          {type: 'bar', x: client.time, y: client.Pe},
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
      <p>
        <button onClick={turnOff}>Turn off client</button>
        <Link id='Link' to='/'>Back to Home Page</Link>
      </p>
    </div>
    )
}
export default Client