import threading
import random
import time 
timer=[]
speed=[]
i=0
Pm=0

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
            print(timer)

def random_wheather():
    threading.Timer(10.0,random_wheather).start()
    random_wheather.x = random.randrange(3)

random_wheather()

def random_speed():
    print('random wheather '+str(random_wheather.x))
    if random_wheather.x==0:
        threading.Timer(2.0,random_speed).start()
        random_value=random.uniform(0.3,5.4)
        if len(speed)>9:
            speed.pop(0)
        speed.append(random_value)
        print(speed)

    elif random_wheather.x==1:
        threading.Timer(2.0,random_speed).start()
        random_value=random.uniform(5.4,10.7)
        if len(speed)>9:
            speed.pop(0)
        speed.append(random_value)
        print(speed)

    elif random_wheather.x==2:
        threading.Timer(2.0,random_speed).start()
        random_value=random.uniform(10.7,17.1)
        if len(speed)>9:
            speed.pop(0)
        speed.append(random_value)
        print(speed)
    
    Pm=(0.5*1.25*speed[-1]**3*3.14*8**2*0.41)/1000
    if (Pm>30):
        Pm=30
    print('Moc mechaniczna' + str(Pm))

    

random_speed()
thread = ThreadingTime()