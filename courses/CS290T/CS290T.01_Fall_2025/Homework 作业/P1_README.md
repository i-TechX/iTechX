# Project1   
# Deadline: 2025/03/21  23:59

The Project1 consists of two parts.

## PartA (30 pts)
There are 2 problems.
Please print it out and complete the question on it, and submit the paper version of the question to TA.

Every problem is 15 pts.

## PartB (70 pts)
**Create a virtual environment using [Anaconda](https://www.anaconda.com/download), with Python 3.6.13 and gym 0.9.4:**
```bash
conda create -n gym_094 python==3.6.13
conda activate gym_094
pip install gym==0.9.4
```

Please carefully read Part_B.pdf and complete the 5 questions Q1-5. 

For Q3 and Q4, please write your answer below:

Q3:  In the Cliff Walk environment, the final policy obtained by Policy Iteration and Value Iteration is the same because both aim to solve for the optimal policy of the Markov Decision Process (MDP), and in the Cliff Walk environment, the optimal policy is unique.

Q4: Value Iteration converges faster than Policy Iteration, because it directly computes the optimal value function by repeatedly updating state values using the Bellman optimality equation, without needing a separate policy evaluation step. Policy Iteration, on the other hand, alternates between evaluating the current policy until convergence and then improving it, making each iteration computationally heavier. Consequently, Value Iteration typically requires fewer iterations and converges more quickly, especially in environments with large state spaces like the Cliff Walk environment.


(Q1)20 + (Q2)20 + (Q3)10 + (Q4)10 + (Q5)10 = 70 pts


Finally, compress the entire folder into a zip file (e.g. 张三_2025233111.zip) and send it to wangyc2023@shanghaitech.edu.cn