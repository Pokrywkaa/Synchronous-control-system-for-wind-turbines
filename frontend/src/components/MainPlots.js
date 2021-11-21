import React from 'react'
import Plot from 'react-plotly.js'


const MainPlots = ({time, pe}) =>{
    return(
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
      
    )
}

export default MainPlots