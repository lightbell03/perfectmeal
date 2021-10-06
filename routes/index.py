import json, sys, io, numpy as np

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = 'utf-8')

def read_in():
    lines = sys.stdin.readlines()
    
    return json.loads(lines[0])

def main():
    lines = read_in()
    np_lines = np.array(lines)
    lines_sum = np.sum(np_lines)
    print("감자")
    print("고구마맛탕")
    print("햄버거")

if __name__ == '__main__':
    main()