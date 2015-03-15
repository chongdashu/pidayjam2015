import math
import random
from random import shuffle

pi_string = str(math.pi)
pi_numbers = [int(s) for s in pi_string if s.isdigit()]

def roulette_one(feature):
  numbers = pi_numbers[:]
  n = random.sample(numbers, 1)[0]

  print "%s %s" %(n,feature)

def main():
  roulette_one("lives")

if __name__ == "__main__":
  main()
