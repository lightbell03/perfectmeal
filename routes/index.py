
import json, sys , numpy as np

def read_in():
    lines = sys.stdin.readlines()
    
    return json.loads(lines[0])

def main():
    lines = read_in()
    np_lines = np.array(lines)
    lines_sum = np.sum(np_lines)
    print("apple");
    print("banana");
    print("cocoa");

if __name__ == '__main__':
    main()