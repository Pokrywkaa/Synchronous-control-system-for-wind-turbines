import { Link } from "react-router-dom"
import React from "react"
import MainPlots from "./MainPlots"
import '../App.css'


const Home = ({speed, time, clients, currentClient, pe}) =>{

    let totalPe

    try{
        totalPe=pe.at(-1).toPrecision(3)
    }
    catch{
    }

    return(
        <div>
            <h3>Connected clients: {clients.map(e=>e.name + ',')}</h3>
            <p>Counter of clients: {currentClient}</p>
            <MainPlots speed={speed} time={time} pe={pe}/>
            <table id='table_parameters'>
                <tbody>
                <tr>
                    <td>Total Electrical Power</td>
                </tr>
                <tr>
                    <td>{totalPe} kW</td>
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