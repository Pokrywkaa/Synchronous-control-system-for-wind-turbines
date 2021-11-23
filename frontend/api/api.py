from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
import threading

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app)
CORS(app)
clients_counter=0
clients=[]
speed=[]
timerList=[]
sum_of_pe=[]
sum_of_pe_demand=[]
i=0



@socketio.on('connect')
def test_connect():
    global clients_counter
    clients_counter+=1
    socketio.emit('clients_count', '{} clients is connected'.format(clients_counter))

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')
    print(request.sid)
    global clients_counter
    global clients
    clients_counter-=1
    clients = list(filter(lambda x: x['id']!=request.sid,clients))
    socketio.emit('clients_count', '{} clients is connected'.format(clients_counter))

@socketio.on('message')
def message(msg):
    print(msg)

@socketio.on('getSpeed')
def speedWind(speed):
    global clients
    clients=list(map(lambda x: {**x, 'speed': speed['speed'], 'time': speed['time']} if x['id']==request.sid else {**x},clients))

    for x in range(len(clients)):
        if len(clients[x]['Pm'])>9:
            clients[x]['Pm'].pop(0)
        if len(clients[x]['Pe'])>9:
            clients[x]['Pe'].pop(0)
        if len(clients[x]['Pe_demand'])>9:
            clients[x]['Pe_demand'].pop(0)

    clients = list(map(lambda x : {**x, 'Cp': x['demand']/(0.5*1.25*x['parameter']['R']**2*3.14*x['speed'][-1]**3)} if 
    x['demand']/(0.5*1.25*x['parameter']['R']**2*3.14*x['speed'][-1]**3)<0.45 else {**x, 'Cp': x['Cp']*0},clients))

    clients = list(map(lambda x: {**x, 'Pm': x['Pm']+[(0.5*1.25*x['speed'][-1]**3*3.14*x['parameter']['R']**2*0.44)/1000],
    'Pe': x['Pe']+[(0.5*1.25*x['speed'][-1]**3*3.14*x['parameter']['R']**2*0.41)/1000*x['parameter']['Efficiency']]}
    if (0.5*1.25*x['speed'][-1]**3*3.14*x['parameter']['R']**2*0.41)/1000<x['parameter']['Pn'] and x['TurnOff'] == False
    else {**x, 'Pm': x['Pm']+[x['parameter']['Pn']],
    'Pe': x['Pe']+[x['parameter']['Pn']*x['parameter']['Efficiency']]} if x['TurnOff']==False else {**x, 'Pe': x['Pe']+[0], 'Pm': x['Pm']+[0]},clients))

    clients = list(map(lambda x: {**x, 'Pe_demand': x['Pe_demand']+[(0.5*1.25*x['speed'][-1]**3*3.14*x['parameter']['R']**2*x['Cp'])/1000]}
    if x['Cp'] and (0.5*1.25*x['speed'][-1]**3*3.14*x['parameter']['R']**2*x['Cp'])/1000 < x['parameter']['Pn'] and x['TurnOff'] == False
    else {**x, 'Pe_demand': x['Pe_demand']+[x['Pe'][-1]]} if x['TurnOff']==False else {**x, 'Pe_demand': x['Pe_demand']+[0]},clients))


    list_of_pe=list(map(lambda x: x['Pe'],clients))
    zipped_list=list(zip(*list_of_pe))

    list_of_pe_demand=list(map(lambda x: x['Pe_demand'],clients))
    zipped_list_demand=list(zip(*list_of_pe_demand))
    
    for item in zipped_list:
        if len(sum_of_pe)>9:
            sum_of_pe.pop(0)
        item=sum(item)
        sum_of_pe.append(item)
    for item in zipped_list_demand:
        if len(sum_of_pe_demand)>9:
            sum_of_pe_demand.pop(0)
        item=sum(item)
        sum_of_pe_demand.append(item)

@socketio.on('username')
def username(client):
    clients_object={
        'id': request.sid,
        'name': client['client'],
        'parameter': {'R': int(client['parameters']['R']),
        'Pn': int(client['parameters']['Pn']),
        'Efficiency': float(client['parameters']['Efficiency'])
        },
        'Pm': [],
        'Pe': [],
        'demand': client['demand'],
        'Cp': 0.44,
        'Pe_demand': [],
        'TurnOff': False
    }
    clients.append(clients_object)



@app.route('/clients', methods = ['GET'])
def get_clients():
    return jsonify({'clients_counter':clients_counter, 'clients':clients, 'Sum_Pe': sum_of_pe, 'Sum_Pe_demand': sum_of_pe_demand})

@app.route('/time', methods = ['GET'])
def get_time():
    return jsonify({'time': timerList, 'speed': speed})

@app.route('/turnOff/<clientID>', methods = ['POST'])
def turnOFF(clientID):
    map={}
    for n in clients:
        map[n['id']]=n
    map[clientID]['TurnOff']=True
    return jsonify({})

@app.route('/turnOn/<clientID>', methods = ['POST'])
def turnOn(clientID):
    map={}
    for n in clients:
        map[n['id']]=n
    map[clientID]['TurnOff']=False
    return jsonify({})




def random_speed():
    global clients
    global sum_of_pe
    global i
    global timerList



    threading.Timer(10.0,random_speed).start()

    if len(timerList)>9:
        timerList.pop(0)
    i+=1
    timerList.append(i)



    
    for client in range(len(clients)):
        socketio.emit('getData', clients[client], room=clients[client]['id'])

random_speed()



if __name__ == '__main__':
    socketio.run(app)



