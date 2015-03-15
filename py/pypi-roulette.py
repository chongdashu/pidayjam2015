import math
import random
from random import shuffle

pi_string = str(math.pi)
pi_numbers = [int(s) for s in pi_string if s.isdigit()]

def roulette_one(feature):
  numbers = pi_numbers[:]
  n = random.sample(numbers, 1)[0]

  print "%s %s" %(n,feature)

def roulette_all(features):
  f = random.sample(features, len(features))
  for n in pi_numbers:
    i = pi_numbers.index(n)
    if (i >= len(features)):
      break
    print "%s %s" %(n, f[pi_numbers.index(n)])

def main():
  print "Trying to roulette one."
  roulette_one("lives")

  print "Trying to roulette list."
  roulette_all(["lives", "enemies", "rounds", "npcs"])

if __name__ == "__main__":
  main()
