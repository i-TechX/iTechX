# Goal
Through this lab, you would modify the cache subsystem of Sniper for two targets:
1. Add an **optimal** replacement policy that can be used by any level of CPU cache;
2. Change the inclusive cache of orignal Sniper to be non-inclusive. 

Note that for both targets, you also need to devise test cases by yourselft to justify that your optimal replacement policy is truly **optimal** and the multi-level cache is **non-inclusive**. A comparison to existing replacement and inclusion policies of Sniper is essential.


# Due date for Lab1
23:59:59 (UTC+8), Monday, 9th November, 2020


# Deliverables
1. A report about what you modify/add in the source code of Sniper, including the file(s) and function(s), how you achieve both (or either of) targets, your observations in implementating and testing, the challenges you face, and so on. In particular, you need to compare your optimal replacement policy to Sniper's existing replacement policies with quantitative analysis. Also, you need to quantitatively compare inclusive cache to non-inclusive cache. Make a readable and neat report.

2. Source codes of modified and/or newly-added files, and a README on which folder(s) to put these files into and how to compile your modified Sniper. This is for reproduction of your results. You can provide a downloadable link of your source codes. However, only put your link of source codes in the report. Do never share it with others.

3. Source codes of test cases.


# Guidelines
It is strongly recommended that you start this lab as early as possible.

You can use the config file of Lab 0, i.e., config-lab0.cfg, for Lab 1. However, you can optionally add L3 cache and/or multi-cores for both targets. 

For the optimal replacement, you need to consider how to see over the future. Note that CPU cache holds both instructions and data for a program.

Submitted source codes must be with comments and descriptions.

If you are unsure of optimal replacement policy and/or non-inclusive cache, please refer to lecture slides and search their definitions in the Internet. As to test cases, you can consider common algorithms like search, sort, B+-tree, binary search tree, and so. 

Bonus points would be accredited to students that submit interesting and reasonable results. Just for one example, an insightful and sound discussion on replacement and inclusion policies with respect to different cache sizes would be a plus. 