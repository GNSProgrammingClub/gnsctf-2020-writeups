# Effortless Values
Points: 100

## Category
Crypto

## Question
Your question may have looked slightly different.
>Hey there, can you rate my Pokemon team? I tried really, really hard on it and put in lots of *effort*! Here's the [team!](https://pokepast.es/59fa13a9d4348304)

## Analysis

The first thing to notice (besides the amazing team) is the fact that the EVs (*Effort Values*) of the Pokémon seem to be awfully specific. You may also notice a certain number repeating itself, namely `95`.

`95` is the ASCII value for `_`, so if you noticed that, you might have also noticed that each EV is actually the ASCII value of a character in the flag! 

Of course, you didn't *have* to notice any repeating patterns. You could have also just figured that the EVs were encoding ASCII values, anyway.

# Solution

Once you figured out what each EV represented, it was straightforward enough to find the flag. You could either plug in each value you found into an [ASCII table](https://asciitable.com), or used a programming language to find the flag.

A neat way of finding the flag is using the `String.fromCharCode()` function in the web console. [here's](files/Teamatina.png) a screenshot of that (note that the _RNG was 3 randomized characters for your challenge).

### Flag
`gnsCTF{d1570r710n_w0r1d_f0r_y0u}`
