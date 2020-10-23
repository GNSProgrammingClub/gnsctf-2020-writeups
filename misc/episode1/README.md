# Episode 1: The Phantom Problem
Points: 100

## Category
Misc

## Question
Your question may have looked slightly different.
>My friend Liam Neeson sent me something about his favorite character in the Prequels, but it seems to be gibberish! Can you help me decode this?  `Njc2ZTczNDM1NDQ2N2I2YTM0NzI1ZjZhMzQ3MjVmNjIzMTZlNmIzNTdk`

## Hints
>I hear this character has two bases of operation... Maybe you can figure them out?
>
>Darth Maul seems to have intercepted Liam's message. So far, I managed to find out that the text is encoded, and I found two numbers: 64 and 16...

## Analysis

There's not much to analyze here, but we can look at the hints for some information: First, the character has two *bases* of operation. Maybe the flag is encoded in two separate bases?

Secondly, we see two numbers in the second hint: 64 and 16. These could be the bases that our flag is encoded in.

# Solution

The first thing we do is convert the base-64 encoded string from the question into ASCII text, which will give us a hexidecimal number. Now we have `676e734354467b6a34725f6a34725f62316e6b357d`.

Next, we take this hexadecimal string and convert it into ASCII, which will give us the flag.

### Flag
`gnsCTF{j4r_j4r_b1nk5}`