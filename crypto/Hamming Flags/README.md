# Hamming Flags
Points: 350

## Category
Crypto

## Question
>I [protecc](files/pngtohbmp.py).
>My isp [attacc](files/isp.py).
>But most importantly, you must use [hamming codes](files/hbmptopng.py) to get the flag [bacc](files/transfered.hbmp).

### Hint
>3blue1brown made some videos about this that could help, they are on youtube.
>
>Don't overcomplicate your solution or get overwhelmed, I did most of the work for you.

## Analysis

After looking through the code and some of the hints, we can see that this challenge is basically removing the noise from an image by using hamming codes.

Hamming codes are a type of error correction method that can detect the exact location of an error in an image.

Hamming codes aren't perfect though and can only detect up to 1 error before being unable to detect the location of the error.

For this challenge, we are going to assume that the challenge author has created the noise in such a way that each section of the image to which hamming codes will be assigned, will only have 1 error max.

Let's go through all the files and what they do:

[pngtohbmp.py](files/pngtohbmp.py): Properly adds hamming codes to the input png file and then saves it in a special format called .hbmp.

[isp.py](files/isp.py): XORs together the hbmp from the previous file and an unviewable noise file. This flips some bits in the hbmp file (hence "noise").

[transfered.hbmp](files/transfered.hbmp): This is the new hbmp file after the noise has been added. It includes the hamming codes from the first script and the noise from the second script.

[hbmptopng.py](files/hbmptopng.py): This is just a helper script that allows the hbmp to be viewable by removing the hamming codes and displaying the data as a png.

This is the challenge, and while it may seem impossible at first, the hamming codes from the hbmp give us enough information to find what the original hbmp was before the noise was added.

I am going to give a brief overview of how hamming codes work, but there are much better resources out there on this including [this video](https://www.youtube.com/watch?v=X8jsijhllIA), which I found very helpful.

Hamming codes operate on two principles, the first is parity bits. Parity bits keep track of the parity of a bit string and make sure that the resulting stream always has an even parity (even number of 1s).

For example:
[1, 0, 1, 1, 0, 0, 0, 1] would have a parity bit set to 0, as it already has an even parity.

[1, 1, 1, 0, 1, 1, 0, 0] would have a parity bit set to 1, as it has an odd parity and needs an extra 1 to have an even parity.

That sounds simple enough, but let's see how it works.

Let's say I had the byte 10010001 and wanted to add a parity bit to the end of it, I would add a 1 to the end of the byte because it has an odd parity. This results in 100100011, which has an even parity.

Now let's say something happened to 1 of the bits and it got flipped, let's flip the third bit (or any bit) to simulate this. This results in 101100011. Now when someone receives this new data, they will see that the parity is odd, meaning an error happened in transfering the data.

While they will be able to understand that there is an error in the data, they will not know exactly which bit got flipped, which brings us into the next principle of hamming codes.

In order to find the position of an error using hamming codes, we will need to use parity groups.
By putting our data down on a 4x4 grid and using the parity groups for this grid, we can check each parity groups' parity to determine if the error happened somewhere in that group.
If we align our groups very specifically, we can make sure that the location is always deducible from checking how many of the 4 parity groups are affected.
This in part has to do with the way binary places work and the fact that the locations of each parity bit of the 4 groups never intersect with another group, it is detailed visually in [this video](https://www.youtube.com/watch?v=b3NxrZOu_CE). 

We can see that the [pngtohbmp.py](files/pngtohbmp.py) file is doing exactly this. 
```py
error_loc = reduce(lambda x, y: x ^ y, [0] + [i for (i, bit) in chunk_iter if bit == '1'])
hamming_codes = [ 1 << idx for idx, bit in enumerate(bin(error_loc)[:1:-1]) if bit == "1" ]
```
By finding the error location of the chunk without hamming codes, for example 1011 and then seperating it into the locations of the parity bits: 0001, 0010, and 1000, we can set all these parity bits to 1 and then have a final error location of 0000, meaning there was no error found. This is the purpose of hamming codes, to make sure that if an error does occur, it's error location can be tracked using the 4 parity bits. Any flip that occurs, let's say at location 0101, will trigger both the 0001 and 0100 parity bits to be incorrect and thus allows the end user to find that the location of the error is 0101.

Whew~! That was a lot to take in, but we are now ready to solve the challenge; if you had any issues understanding the above explanation, please check out the 2 videos I linked above, they are very helpful as this topic is very visual.

# Solution

The solve script is not very long, we can repurpose the `hamming_to_chunk` function in the [hbmptopng.py](files/hbmptopng.py) script to use the hamming codes before discarding them. We can also use the same `error_loc` code from the [pngtohbmp.py](files/pngtohbmp.py) script to find the error location in the hbmp.

Inside the `hamming_to_chunk` function, before the hamming codes are removed we will add the following to solve the challenge.
```py
error_loc = reduce(lambda x, y: x ^ y, [0] + [i for (i, bit) in enumerate(chunk) if bit == '1'])
chunk = [bit for bit in chunk]
chunk[error_loc] = '0' if chunk[error_loc] == '1' else '1'
```

And that's it! After running the solve script on the [transfered.hbmp](files/transfered.hbmp) file, we get the following image:
![Flag Image](solution/transfered.png)

Full solution script: [solve.py](solution/solve.py)

### Flag
`gnsCTF{E14hLgZ6_Acx3_PwnY2}`