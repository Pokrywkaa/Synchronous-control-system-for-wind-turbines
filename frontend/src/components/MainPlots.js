import React from 'react'
import Plot from 'react-plotly.js'


const MainPlots = ({time, pe, pe_demand}) =>{
    return(
      <div>
      <Plot
        data={[
          {
            x: time,
            y: pe_demand,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'black'},
            name: 'Demand'
          },
          {type: 'bar', x: time, y: pe, name: 'Total'},
        ]}
        layout={{width: 1400, height: 400, title: 'Total electrical power',
        xaxis:{title: 'time [s]'},
        yaxis:{title: 'Pe [kW]'},
      }}
      />
      </div>
      
    )
}

export default MainPlots