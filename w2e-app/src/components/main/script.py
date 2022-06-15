import json
import re
import random

with open("input.txt", 'r') as f:
    l = f.readlines()
words = {}
cnt = 0

for i in l:
    arr = re.split(r' |, |\n', i)
    random.shuffle(arr)
    for j in arr:
        if j != '':
            words[cnt] = j
            cnt += 1

# print(*words.items(), sep='\n')
api = []
f = open("words.json", 'w')
f.write('[')
for i, j in words.items():
    f.write((json.dumps(
        {
            "id": i,
            "name": j
        }
    )))
    f.write(',\n')
f.write(']')
f.close()

# print(*api, sep=',\n')