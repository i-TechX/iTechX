# copy and paste your answers into each of the below variables 
# NOTE: do NOT rename variables
# Modify the return statements to return the relevant values
# Include 1-2 sentences (as a python comment) above each answer explaining your reasoning.

import math

#Q1ai 
io_split_sort = 680
#read number=320/8=40 write number=320*2=640 total=40+640=680

#Q1aii
merge_arity = 4
#floor((40-1)/8)=4

#Q1aiii 
merge_passes = 2
#ceil(log_4(320/40))=2

#Q1aiv 
merge_pass_1 = 680
#all pages are read and written once
#read number=320/8=40 write number=320*2=640 total=40+640=680

#Q1av
total_io = 2040
#the second pass IO is also 680 there are 3*680=2040

#Q1bi 
def cost_initial_runs(B, N, P):
    # BEGIN YOUR CODE 
    return 2*N+N/P
    # END YOUR CODE 
#read cost N/P write cost 2*N
    
#Q1bii 
def cost_per_pass(B, N, P):
    # BEGIN YOUR CODE 
    return 2*N+N/P
    #END YOUR CODE
#read cost N/P write cost 2*N

#Q1biii
def num_passes(B, N, P):
    # BEGIN YOUR CODE
    merge_arity = math.floor(B/P)
    return math.ceil(math.log(N/(B+1),merge_arity))
    # END YOUR CODE
#ceil(log_merge_arity(N/(B+1)))
    
#Q1c 
# Save the optimal value here
P = 11
p = 10
# Save a list of tuples of (P, io_cost) here, for all feasible P's
points = []
for p in range(1,50):
        points.append((p,external_merge_sort_cost(99,900,p)))
# p should satisfy 100 % p == 0

#Q2a 
IO_Cost_HJ_1 = 7560
#3(P_R+P_S)+P_RS+3(P_RS+P_T)+P_RST=3(20+200)+100+3(100+2000)+500=7560
IO_Cost_HJ_2 = 11160
#3(P_T+P_S)+P_ST+3(P_ST+P_R)+P_RST=3(2000+200)+1000+3(1000+20)+500=11160
IO_Cost_SMJ_1 = 16160
#sort(P_R)=2*20*(1+ceil(log(31,20/2/32)))=40 sort(P_S)=2*200*(1+ceil(log(31,200/2/32)))=800
#sort(P_RS)=2*100*2=400 sort(P_T)=2*2000*3=12000
#sort(P_R)+sort(P_S)+P_R+P_S+P_RS+sort(P_T)+sort(P_RS)+P_RS+P_T+P_RST
#=40+800+20+200+100+400+12000+100+2000+500=16160
IO_Cost_SMJ_2 = 21560
#sort(P_T)=12000 sort(P_S)=800
#sort(P_ST)=1000*2*2=4000 sort(P_R)=40
#sort(P_T)+sort(P_S)+P_T+P_S+P_ST+sort(P_ST)+sort(P_R)+P_ST+P_R+P_RST
#=12000+800+2000+200+1000+4000+40+1000+20+500=21560
IO_Cost_BNLJ_1 = 8920
#P_R+ceil(P_R/(B-2))*P_S+P_RS++P_RS+ceil(P_RS/(B-2))*P_T+P_RST=
#20+ceil(20/30)*200+100+100+ceil(100/30)*2000+500=8920
IO_Cost_BNLJ_2 = 16720
#P_S+ceil(P_S/(B-2))*P_T+P_ST+P_R+ceil(P_R/(B-2))*P_ST+P_RST=
#200+ceil(200/30)*2000+1000+20+ceil(20/30)*1000+500=16720
#Q2b 
P_R = 1000
P_S = 1000
P_T = 10
P_RS = 10
P_RST = 10
B = 32
#3(P_R+P_S)+P_RS+sort(P_RS)+sort(P_T)+P_RS+P_T+P_RST<
#3(P_RS+P_T)+P_RST+sort(P_R)+sort(P_S)+P_R+P_S+P_RS
HJ_IO_Cost_join1 = 6010
SMJ_IO_Cost_join2 = 70

SMJ_IO_Cost_join1 = 10010
HJ_IO_Cost_join2 = 70
#6080<10080

#Q3ai
def lru_cost(N, M, B):
    if N>B+1:
        return M*N
    else:
        return N
#when N pages can fit in the buffer,every time hits, cost N, else no hit, cost M*N

#Q3aii 
def mru_cost(N, M, B):
    if N>B+1:
        buffer = []
        cost = 0
        pos = 0
        for m in range(0,M):
            for n in range(0,N):
                if n not in buffer:
                    if(len(buffer)<B+1):
                        buffer.append(n)
                    else:
                        buffer[pos]=n
                    cost+=1
                pos = buffer.index(n)
        return cost
    else:
        return N
#when N pages can fit in the buffer,every time hits, cost N
#else, simulate the MRU algorithm 
#Q3aiii
# Provide a list of tuple (m, difference between LRU and MRU in terms of IO cost) here:

p3_lru_points = []
for M in range(1, 21):
    lru = lru_cost(7, M, 4)
    mru = mru_cost(7, M, 4)
    p3_lru_points.append((M,abs(lru - mru)))

#Q3bi 
def clock_cost(N, M, B):
    if N>B+1:
        return M*N
    else:
        return N
#when N pages can fit in the buffer,every time hits, cost N, else no hit, cost M*N

#Q3bii 
# Provide a list of tuple (m vs the absolute value of the difference between LRU and CLOCK in terms of IO cost) here:
p3_clock_points = []
for M in range(1, 21):
    lru = lru_cost(7, M, 4)
    clock = clock_cost(7, M, 4)
    p3_clock_points.append((M,abs(lru - clock)))

'''
It does not prevent sequential flooding. It performs the same as LRU. "second chance" bit is never set to 1.
'''

#Q4ai
def hashJoin(table1, table2, hashfunction,buckets):
    # Parition phase 
    t1Partition = partitionTable(table1,hashfunction,buckets)
    t2Partition = partitionTable(table2,hashfunction,buckets)
    # Merge phase
    result = []
    for i in range(0,buckets):
        for t1Entry in t1Partition[i]:
            for t2Entry in t2Partition[i]:
                if t1Entry.playername == t2Entry.playername:
                    result.append((t1Entry.teamname, t1Entry.playername, t2Entry.collegename))
    
    # ANSWER GOES HERE
    
    # To populate your output you should use the following code(t1Entry and t2Entry are possible var names for tuples)
    # result.append((t1Entry.teamname, t1Entry.playername, t2Entry.collegename))
    return result

#Q4aii
'''
the total number of entries output by my algorithm is 12740, there are duplicates
the runtime of my algorithm seems notreasonable, it's too slow
it's because the output of hash function is not uniform enough, it is not well-distributed
'''

#Q4bi 
# partition- a table partition as returned by method partitionTable
# return value - a float representing the skew of hash function (i.e. stdev of chefs assigned to each restaurant)
def calculateSkew(partition):
    # ANSWER STARTS HERE
    sum = 0
    for i in range(0, len(partition)):
        sum += len(partition[i])
    mean = sum / len(partition)    
    skew = 0
    for i in range(0, len(partition)):
        skew += (len(partition[i])-mean)**2
    skew = math.sqrt(skew/len(partition))    
    # ANSWER ENDS HERE
    return skew

#Q4bii 
# Design a better hash function and print the skew difference for 
def hBetter(x,buckets):
    rawKey = hash(x)
    return rawKey % buckets

#Q4biii 
res1 = hashJoin(teams, colleges, hBetter, buckets)

#speedup here =5549-143=5406ms 38.8 times faster than before
#the algorithm runs faster since the hash function is better

#Q4c
flocco_elite = True
