from typing import IO
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import threading
import random
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app)
CORS(app)
clients_counter=0
clients=[]
speed=[]
timer=[]
sum_of_pe=[]
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
        'Pe': []
    }
    clients.append(clients_object)



@app.route('/clients', methods = ['GET'])
def get_clients():
    return jsonify({'clients_counter':clients_counter, 'clients':clients, 'Sum_Pe': sum_of_pe})

@app.route('/time', methods = ['GET'])
def get_time():
    return jsonify({'time': timer, 'speed': speed})


class ThreadingTime():
    def __init__(self, interval=1):
        self.interval=interval
        thread = threading.Thread(target=self.run, args=())
        thread.daemon = True
        thread.start()
    def run(self):
        global i
        while True:
            if len(timer)>9:
                timer.pop(0)
            i+=1
            timer.append(i)
            time.sleep(2)

def random_wheather():
    threading.Timer(10.0,random_wheather).start()
    random_wheather.x = random.randrange(3)
    for i in range(len(clients)):
        socketio.emit('getData', clients[i], room=clients[i]['id'])

random_wheather()

def random_speed():
    global clients
    global sum_of_pe
    if random_wheather.x==0:
        threading.Timer(2.0,random_speed).start()
        random_value=random.uniform(0.3,5.4)
        if len(speed)>9:
            speed.pop(0)
        speed.append(random_value)

    elif random_wheather.x==1:
        threading.Timer(2.0,random_speed).start()
        random_value=random.uniform(5.4,10.7)
        if len(speed)>9:
            speed.pop(0)
        speed.append(random_value)

    elif random_wheather.x==2:
        threading.Timer(2.0,random_speed).start()
        random_value=random.uniform(10.7,17.1)
        if len(speed)>9:
            speed.pop(0)
        speed.append(random_value)

    for x in range(len(clients)):
        if len(clients[x]['Pm'])>9:
            clients[x]['Pm'].pop(0)
        if len(clients[x]['Pe'])>9:
            clients[x]['Pe'].pop(0)
    
    clients = list(map(lambda x: {**x, 'Pm': x['Pm']+[(0.5*1.25*speed[-1]**3*3.14*x['parameter']['R']**2*0.41)/1000],
    'Pe': x['Pe']+[(0.5*1.25*speed[-1]**3*3.14*x['parameter']['R']**2*0.41)/1000*x['parameter']['Efficiency']]}
    if (0.5*1.25*speed[-1]**3*3.14*x['parameter']['R']**2*0.41)/1000<x['parameter']['Pn'] 
    else {**x, 'Pm': x['Pm']+[x['parameter']['Pn']],
    'Pe': x['Pe']+[x['parameter']['Pn']*x['parameter']['Efficiency']]}, clients))

    list_of_pe=list(map(lambda x: x['Pe'],clients))
    zipped_list=list(zip(*list_of_pe))

    for item in zipped_list:
        if len(sum_of_pe)>9:
            sum_of_pe.pop(0)
        item=sum(item)
        sum_of_pe.append(item)

    

random_speed()
thread = ThreadingTime()


if __name__ == '__main__':
    socketio.run(app)



