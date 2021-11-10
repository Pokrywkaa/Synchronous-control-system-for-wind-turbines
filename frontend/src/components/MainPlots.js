import React from 'react'
import Plot from 'react-plotly.js'


const MainPlots = ({time, speed, pe}) =>{
    return(
      <div>
        <Plot
        data={[
          {
            x: time,
            y: speed,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: time, y: speed},
        ]}
        layout={{width: 400, height: 250, title: 'Wind speed',
        xaxis:{title: 'time [s]'},
        yaxis:{title: 'speed [m/s]'} 
      }}
      />
      <div>
      <Plot
        data={[
          {
            x: time,
            y: pe,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'black'},
          },
          {type: 'bar', x: time, y: pe},
        ]}
        layout={{width: 1000, height: 300, title: 'Total electrical power',
        xaxis:{title: 'time [s]'},
        yaxis:{title: 'Pe [kW]'},
      }}
      />
      </div>
      </div>
      
    )
}

export default MainPlots