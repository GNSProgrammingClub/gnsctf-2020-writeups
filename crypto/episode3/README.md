# Episode 3: Revenge of the Bits
Points: 200

## Category
Crypto

## Question
Your question may have looked slightly different.
>General Grievous just sent something to the Separatists, but it seems to just be a bunch of white noise! Can you help us decode it? [flag.bmp](files/flag.bmp)

## Hints
>I've been looking at this image for a while, and I'm starting to think it's encoded. I found something out about how to crack it, and my findings are [here](files/Classified Info.png). I think every single pixel stores something, but what...?

## Analysis

The first thing one might do when they look at this picture is assume that every pixel stores a bit. After all, the file is a *bit* map. The logical assumption to make would be that a white pixel stores a 1, and a black pixel stores a 0.

Next, look at the dimensions of the picture. Notice it's 8 pixels tall. What method of encoding text uses 8 bits per character? ASCII. It can thus be assumed that each column stores an ASCII character.

Finally, look at the hint. My (poorly drawn) arrows are pointing downward, so each column is probably going to be read top to bottom.

# Solution

Armed with the information that each column stores one ASCII character, we can get to work on solving the challenge.

I'll put the full Python script here first, and then break it down bit by bit.

```py
from PIL import Image
import os
import binascii


script_dir = os.path.dirname(__file__) #The directory in which this script is.
rel_path = "flag.bmp" #The name of the bitmap file.

abs_file_path = os.path.join(script_dir, rel_path) #The total file path.

im = Image.open(abs_file_path) 

width, height = im.size

result = ""

for x in range(width):
    for y in range (height):
        r,g,b = im.getpixel((x, y))
        if (r == 255):
            result += '1' #If we have a white pixel, it represents a 1.
        else:
            result += '0' #If we have a black pixel, it represents a 0.

n = int(result, 2) #Tell Python that our string is actually a base 2 number.
print(binascii.unhexlify('%x' % n)) #Convert our base2 string into ASCII.
```

Let's look at the imports first.

```py
from PIL import Image
import os
import binascii
```

PIL is a library in Python used for image processing. We import the 'Image' module here, as it has the functions we need.

OS is a way of using operating system functionality within Python. We use this to get the file path.

Binascii is a way of encoding and decoding data in Python, which we will use to decode our flag.

```py
script_dir = os.path.dirname(__file__) #The directory in which this script is.
rel_path = "flag.bmp" #The name of the bitmap file.

abs_file_path = os.path.join(script_dir, rel_path) #The total file path.

im = Image.open(abs_file_path) 

width, height = im.size

result = ""
```

This is all of our initial setup. First, we get our filepath by getting the directory that our script (\_\_file\_\_) is stored in. Next, we join that directory with the filename for the bitmap, and we have our total filepath.

Then we open the bitmap using Image.open, and store a width and height variable using the size of the image. 

Finally, we make a blank string for the result.

```py
for x in range(width):
    for y in range (height):
        r,g,b = im.getpixel((x, y))
        if (r == 255):
            result += '1' #If we have a white pixel, it represents a 1.
        else:
            result += '0' #If we have a black pixel, it represents a 0.
```

This is the meat of the program. Our outer loop is the width, and our inner loop is the height, meaning we'll loop through every column (top to bottom) before moving on to the next row (left to right).

Inside of the inner loop, we check our current pixel. If the red value is 255, our pixel is white, so we add a `1` to our result string. If it's not, our pixel is black, so that's a `0`.

```py
n = int(result, 2) #Tell Python that our string is actually a base 2 number.
print(binascii.unhexlify('%x' % n)) #Convert our base2 string into ASCII.
```

Finally, we decode our data. The first thing we do is make a binary integer called `n`, which is our string casted to an int with a base of 2.

Next, we use binascii's `unhexlify` function, which will convert hexadecimal into ASCII. We use `%x` to tell Python that we're going to have a hex value here, and then we tell Python that our hex value will be our binary integer `n`. Python will then convert `n` into hex, and use that as the argument for the `unhexlify` function.

This will print out the *inside* of the flag, so make sure to encase it in the flag format when you're done!

### Flag
`gnsCTF{y0u_4r3_4_b0ld_0n3}`
