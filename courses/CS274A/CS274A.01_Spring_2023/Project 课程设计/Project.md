«««
code: CS274A
name: Natural Language Processing
semester: Spring 2023
category: Project 课程设计
title: Project
»»»

# CS274A Natural Language Processing Spring 2023 Project

The grader of this project is originally modified from the pacman project from CS188 in Berkeley, developed in spring 2019. Problems are designed for CS274A Natural Language Processing course project.

## Install

You need to install `pytorch` to finish this project. The official website is [here](https://pytorch.org/), along with the [documents](https://pytorch.org/docs/stable/). Use

```sh
    pip install torch
```

to install `pytorch`. We recommend to use python with version >= 3.7.0 for this project.

## To get started

If you're familiar with the pacman project, you may skip this session since the usage is almost the same. If you've never tried the pacman project, here are some commands that might be helpful:

If you want to get help, run
```sh
    python autograder.py -h
```

If you want to test your code, run
```sh
    python autograder.py
```

If you want to test your code for a specified question, for example, question 1, run
```sh
    python autograder.py -q q1
```

If you want to mute outputs, run
```sh
    python autograder.py -m
```

If you want to test your code for a specified testcase, for example, q1/test_1.test, run
```sh
    python autograder.py -t test_cases/q1/test_1
```

If you want to show the input parameter of your failed cases in question 1, run
```sh
    python autograder.py -q q1 -s
```


## Question 1: Transition-based dependency parsing (4 pts)

**Author**: Haoyi Wu (wuhy1@)

In this task, you need to implement the transition-based dependency parsing algorithm. The algorithm details are described in Lecture 11.

Implement the `parse` function of the `TransitionBasedParser` in `parser.py`. All instructions are written in the docstring in this function. Read them carefully before you get started. We also provide a copy below: 

The input is a list of tokens. Your task is to return the parsed dependency graph. The dependency graph should be an instance of `DependencyGraph` in `parsers_util.py`, which is a list of dependency nodes.

You need to call the transition system in order to get the next action:

```python
action = self.transition_system.get_next_action(state)
```

where `state` is the current parser state. In this project, we simply use a transition system that returns a fixed sequence of actions, so you can pass whatever you like into the transition system, or just ignore it:

```python
action = self.transition_system.get_next_action()
```

The transition system will only return one of the following actions: `SHIFT`, `LEFT-ARC`, or `RIGHT-ARC`. If you find that the transition system takes an invalid move, raise the `TransitionError` exception:

```python
raise TransitionError("Invalid move")
```

Example to construct a parse tree for a dummy sentence:

```python
tokens = ["I", "am", "here"]
dummy_nodes = [DependencyNode(token) for token in [ROOT] + tokens]
dummy_nodes[1].head = dummy_nodes[2]
dummy_nodes[2].head = dummy_nodes[0]
dummy_nodes[3].head = dummy_nodes[2]
graph = DependencyGraph(dummy_nodes)
print(graph)
# sentence: ROOT I am here
# heads:    -1   2 0  2
```

**HINT**: This question is quite easy. There's no need to implement complex data structures. Make good use of the data structures in `util.py`.

**HINT**: The algorithm detail should be consistent with the slides.

To test your implementation, run
```sh
python autograder.py -q q1
```

This question will be automatically graded. The result from the autograder will be your final grade.

## Question 2: Inside-outside are just backprop! (4 pts)

**Author**: Songlin Yang*

<sub>* Songlin Yang is not the TA this semester. Make a post on Piazza if you have any questions.</sub>

In `hmm.py`,  we show an example of 

- **vectorized** implementation of the forward-backward algorithm.
  -  Vectorization and broadcasting ways to speed up the compute time and optimize memory usage while doing mathematical operations, which is commonly used in machine learning.  
- using **automatic differentiation** to compute nonterminal marginals for each possible span. 
  - In practise, we do not bother writing tedious backward or outside algorithm. Instead, we only implement the forward or inside algorithm and then leverage automatic differential to compute marginals of interest. 



In this task, you need to implement the **vectorized** inside and outside algorithm, and to compute the span marginals using **both** inside-outside algorithm and **automatic differentiation**, similar to what implemented in `hmm.py` .  The PCFG is defined the same as [[Section 2.1]](http://www.cs.columbia.edu/~mcollins/papers/naacl13tensor.pdf) , so your functions will receive three inputs:  

- unary: emission probability matrix of size $l \times m$ 
- binary: binary rule probability tensor of size $m \times m \times m$ 
- root: start rule probability vector of size $m$ 

where $l$ is the sentence length and m is the number of nonterminal symbols.  We recomend you to follow the inclusive/exclusive indexing notations (i.e., left close, right open) to define chart items, so the chart should be of size $(l+1) \times (l+1) \times m$. You need to implement

-   `inside`: you should implement the inside algorithm and return the inside score chart and the log-partition function, similar to `forward` in   `hmm.py` 

-  `outside`: you should implement the outside algorithm and return the outside score chart, similar to   `backward` in   `hmm.py`

-   `inside_outside:` you should  compute the nonterminal marginals for each span calling  `inside` and   `outside`, similar to   `forward_backward` in    `hmm.py`

-  `inside_backprop`: you should use back-propagation to compute the nonterminal marginals for each span, similar to   `forward_backprop` in   `hmm.py`

  

The inside-outside algorithm is described in Lecture 10. There're also some supplementary materials:

1. [[link]](http://www.cs.columbia.edu/~mcollins/io.pdf) A nice tutorial introducing the inside-outside algorithm.
2. [[link]](http://www.cs.columbia.edu/~mcollins/papers/naacl13tensor.pdf) Section 2.2, the tensor form of the inside algorithm. This is relevant to your vectorized implementation of the inside algorithm.
3. [[link]](https://www.cs.jhu.edu/~jason/papers/eisner.spnlp16.pdf) Inside-outside are just back-prop



Hint:

- You should use `logsumexp` function, manipulating probabilities in the log-space to deal with the numeical stability issue.
- The sum of marginals should equal to $2l-1$ , since for a length-$l$ sentence, its binary parse tree has exactly $2l-1$ spans. This fact can be leveraged for the purpose of debugging. 

- Do not forget to check out whether  `inside_outside` and `inside_backprop` return the same values.  



Grading:

- This question will be manually graded after the deadline. The autograder is only used for the sanity check.

- Your implementation should be vectorized. You are not allowed to use for-loop to iterate over nonterminals. Otherwise, you will receive a zero score.  

- Each function contributes to 25% final score. 

To run sanity check for your implementation, run
```sh
python autograder.py -q q2
```
But remember the sanity check won't give you any credit, this question will be manually graded after the deadline.

## Submit

Submit `parsers.py` and `inside.py` to [gradescope](https://www.gradescope.com/courses/509189/). The deadline is **11:59pm, May 25, Thursday**.