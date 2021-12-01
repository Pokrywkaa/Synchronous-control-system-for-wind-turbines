import { Link } from "react-router-dom"
import React from "react"
import MainPlots from "./MainPlots"
import '../App.css'


const Home = ({pe_demand, time, clients, currentClient, pe}) =>{

    let totalPe
    let actual_pe_demand

    try{
        totalPe=pe.at(-1).toPrecision(3)
        actual_pe_demand=pe_demand.at(-1).toPrecision(3)
    }
    catch{
    }

    return(
        <div>
            <h3>Connected clients: {clients.map(e=>e.name + ',')}</h3>
            <p>Number of clients: {currentClient}</p>
            <MainPlots pe_demand={pe_demand} time={time} pe={pe}/>
            <table id='table_parameters'>
                <tbody>
                <tr>
                    <td>Total Electrical Power</td>
                    <td>Total Supplied Electrical Power</td>
                </tr>
                <tr>
                    <td>{totalPe} kW</td>
                    <td>{actual_pe_demand} kW</td>
                </tr>
                </tbody>
            </table>
            <table id='table_client'>
                <tbody>
                <tr>
                {clients.map(client=>(<td key={client.id}>
                <Link id='Link' to={`/client/${client.id}`}>{client.name}</Link>
                 </td>))}
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Home