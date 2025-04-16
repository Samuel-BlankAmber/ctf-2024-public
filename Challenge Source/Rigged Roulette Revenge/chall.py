# !/usr/bin/env python3

import os
from crypto import rng

FLAG = os.getenv("FLAG", "KAINOS{fake_flag}")

MIN_NUM = 0
MAX_NUM = 36
PAYOUT = 35

if __name__ == "__main__":
    print(""" /$$$$$$$  /$$                                     /$$       /$$$$$$$                      /$$             /$$     /$$
| $$__  $$|__/                                    | $$      | $$__  $$                    | $$            | $$    | $$
| $$  \ $$ /$$  /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$      | $$  \ $$  /$$$$$$  /$$   /$$| $$  /$$$$$$  /$$$$$$ /$$$$$$    /$$$$$$
| $$$$$$$/| $$ /$$__  $$ /$$__  $$ /$$__  $$ /$$__  $$      | $$$$$$$/ /$$__  $$| $$  | $$| $$ /$$__  $$|_  $$_/|_  $$_/   /$$__  $$
| $$__  $$| $$| $$  \ $$| $$  \ $$| $$$$$$$$| $$  | $$      | $$__  $$| $$  \ $$| $$  | $$| $$| $$$$$$$$  | $$    | $$    | $$$$$$$$
| $$  \ $$| $$| $$  | $$| $$  | $$| $$_____/| $$  | $$      | $$  \ $$| $$  | $$| $$  | $$| $$| $$_____/  | $$ /$$| $$ /$$| $$_____/
| $$  | $$| $$|  $$$$$$$|  $$$$$$$|  $$$$$$$|  $$$$$$$      | $$  | $$|  $$$$$$/|  $$$$$$/| $$|  $$$$$$$  |  $$$$/|  $$$$/|  $$$$$$$
|__/  |__/|__/ \____  $$ \____  $$ \_______/ \_______/      |__/  |__/ \______/  \______/ |__/ \_______/   \___/   \___/   \_______/
               /$$  \ $$ /$$  \ $$
              |  $$$$$$/|  $$$$$$/
               \______/  \______/
""")
    money = 100
    print("Welcome to my EXTRA-RIGGED casino!")
    print("The only game we have on offer today is Roulette.")
    print(f"You will start with ${money}.")
    print("Options:")
    print("1. Spin the wheel!")
    while True:
        choice = input("> ")
        if choice == "1":
            guesses = [int(n) for n in input("Enter the numbers you wish to bet on: ").split()]
            bets = [int(n) for n in input("Enter the amount you wish to bet on each number: ").split()]
            assert len(guesses) == len(bets)
            assert all(MIN_NUM <= x <= MAX_NUM for x in guesses)
            assert all(x >= 0 for x in bets)
            for bet in bets:
                money -= bet
            assert money >= 0
            landed_number = rng(MIN_NUM, MAX_NUM)
            if landed_number in guesses:
                prize = bets[guesses.index(landed_number)] * PAYOUT
                money += prize
                if money >= 1_000_000_000_000_000_000_000_000:
                    print("One septillion dollars!?!? How did you even get much???")
                    print("Here's a flag for your troubles:")
                    print(FLAG)
                    exit()
                else:
                    print(f"Congratulations! You won ${prize}.")
            else:
                print(f"Wrong! It landed on {landed_number} :(")
                if money == 0:
                    print("You are out of money! Game over.")
                    exit()
            print(f"You now have ${money}.")
