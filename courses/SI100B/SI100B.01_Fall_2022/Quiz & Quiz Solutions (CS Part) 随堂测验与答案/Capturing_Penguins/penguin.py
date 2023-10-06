# ============= YOU NEED TO WRITE YOUR CODE IN THE FUNCTION =============
def solve(num_rows, num_columns, actions):
    # implement your algorithm here

    
    ans = 0 # Your answer
    return ans


# ========== DON'T MODIFY THIS ==========
def main():
    num_rows, num_columns = map(int, input().split()) # Input the number of columns and the number of rows
    actions = eval(input()) # Input the list of actions
    print(solve(num_rows, num_columns, actions))



if __name__ == "__main__":
    main()