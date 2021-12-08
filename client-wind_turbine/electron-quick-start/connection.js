const electron = require('electron')
const {ipcRenderer} = electron
const csv = require('csv-parser')
const fs = require('fs')

var Chart = require('chart.js')

let socket 

let Pm=0
let Pe=0
let Pe_demand=0
let listPe=[]
let listePe_demand=[]
let time=[]
let speed=[]
let setTime=0
let listTime=[]
let demand=0
let Cp=0


const h1 = document.getElementById('h1')
const p1 = document.getElementById('p1')

const config = document.getElementById('config')
const div = document.getElementById('client')
const form = document.querySelector('#connect')






const uploadFile =()=>{
  console.log('click')
  const uploadButton = document.querySelector("#select_file")
}

form.addEventListener('submit', click_button=(e)=>{
  e.preventDefault()
  const IP = document.querySelector('#IP').value
  const username = document.querySelector('#username').value
  const file = document.querySelector('#parameters').value
  demand = parseInt(document.querySelector('#demand').value)

  if (IP=='' || username=='' || !Number.isInteger(demand) || file==''){
    alert('wrong input values')
    window.location.reload(true)
    return false
  }
  else{
  socket = io("http://"+IP+":5000")
  socket.emit('message', `Client is connected`)
  alert('Connected')
  socket.on('clients_count', (msg)=>{
    console.log(msg)
  })
  let timer = setInterval(()=>{

    socket.on('getData', (client)=>{
      Pe=client.Pe.at(-1).toPrecision(3)
      Pm=client.Pm.at(-1).toPrecision(3)
      Pe_demand=client.Pe_demand.at(-1).toPrecision(3)
      listPe=client.Pe
      listTime=client.time
      listePe_demand=client.Pe_demand
      demand=client.demand/1000
      Cp=client.Cp.toPrecision(3)
      if (Cp==0){
        Cp=0.45
      }
    })
    p2.innerHTML=`Generation Total Mechanical Power = ${Pm} kW`
    p3.innerHTML=`Generation Total Electrical Power = ${Pe} kW`
    p4.innerHTML=`Eletrical Power Supplied = ${Pe_demand} kW`
    p5.innerHTML=`Demand Electrical Power = ${demand} kW`
    p6.innerHTML=`Turbine Power Factor = ${Cp}`
    var ctx = document.getElementById('chart').getContext('2d');
    var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
    labels: listTime,
    datasets: [{
        label: 'Electrical Power',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: listePe_demand,
    }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            min: 0, 
            max: 200
          }
        }]
      }
    }
});
  },10000)
  const randomWheather=()=>{
    let min=10
    let max=30
    let randInterval = Math.floor(Math.random()*(max-min+1)+min)
    let windForce = Math.floor(Math.floor(Math.random()*3))
    for(var i=0; i<randInterval; i++){
      let speedWind=0
       setTimeout(()=>{
        if (speed.length>9){
          speed.shift()
        }
        if (windForce==0){
          speedWind=(Math.random()*5.4)
          speed.push(speedWind)
        }
        if (windForce==1){
          speedWind=Math.random()*(10.7-5.4)+5.4
          speed.push(speedWind)
        }
        if (windForce==2){
          speedWind=Math.random()*(17.1-10.7)+10.7
          speed.push(speedWind)
        }
        setTime+=1
        if (time.length>9){
          time.shift()
        }
        time.push(setTime)
        socket.emit('getSpeed', {'speed': speed, 'time':time})
      },i*10000)
    }
    console.log('Wait for ' + randInterval + ' seconds')
    setTimeout(randomWheather, randInterval * 10000)
  }
  randomWheather()


  ipcRenderer.send('IP:add', IP)
  ipcRenderer.send('username:add', username)

  config.remove()
  div.style.display='inline'
  document.getElementById('chart').style.display='inline'
  h1.innerHTML=`${username}`
  p1.innerHTML=`IP: ${IP}`
  fs.createReadStream(file+'.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row)
    socket.emit('username', {"parameters": row, "client": username, "demand": demand*1000})
  })
  .on('end', () => {
    console.log('CSV file successfully processed')
})
}
})

