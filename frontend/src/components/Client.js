import React, {useState, useEffect} from "react"
import { Link, useRouteMatch } from "react-router-dom"
import Plot from "react-plotly.js"

const Client = ({time, clients}) =>{


    const match = useRouteMatch('/client/:id')
    let client = match
    ? clients.find(client=>client.id === match.params.id)
    : null


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

    return(
    <div>
      <h1>{client.name}</h1>
      <Plot
        data={[
          {
            x: time,
            y: client.Pe,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'blue'},
          },
          {type: 'bar', x: time, y: client.Pe},
        ]}
        layout={{width: 1200, height: 400, title: 'Electrical Power',
        xaxis:{title: 'time [s]'},
        yaxis:{title: 'Pe [kW]'} 
      }}
      />
      <table id='table_parameters'>
        <tbody>
        <tr id='tr1'>
          <td id='td1'>Rated Power</td>
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
        <Link to='/'>Back to Home Page</Link>
      </p>
    </div>
    )
}
export default Client