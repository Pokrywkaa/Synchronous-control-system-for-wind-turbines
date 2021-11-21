import time

x=[{'name':'Damian', 'age':[1,2,7]}, {'name':'Marek','age':[3,4,5]}, {'name':'Pawel','age':[1,2,3]}]

s=list(map(lambda y: y['age'],x))
y=list(zip(*s))
z=[sum(item) for item in y]
print(z)

# while i<10:
#     x=list(map(lambda y: {**y, 'age': y['age']+[i]}, x))
#     i+=1


demand =1000
T1=130
T2=500
T3=400
T4=200

T=[T1,T2,T3,T4]

y=[]
# while sum(T)>demand:

#     T[T.index(min([x for x in T if x!=0]))]=0

# print(T)


# while z[-1]>7:
#     for i in x:
#         y.append(list(i['age'])[-1])
#     x[y.index((min([i for i in y if i!=0])))]['age'][-1]=0


for i in x:
    y.append(list(i['age'])[-1])
while z[-1]>7:
    x[y.index((min([i for i in y if i!=0])))]['age'][-1]=0
    y[y.index((min([i for i in y if i!=0])))]=0
    print(y)



# x[x.index(min([i['age'] for i in x if i!=0]))]['age']=0