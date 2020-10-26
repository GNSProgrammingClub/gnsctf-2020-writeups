# Powerpoof Gorls

Points: 200

## Category

Rev

## Question

>Powerpoof! Professor Uranium was preparing the flag when suddenly, he spilled some Chemical X all over it! Recover the flag, and save the city!  [Source](./files/source.js), [result](./files/result.txt).

### Hint

>Flag is in the format gnsCTF{...}
>
>If only we could find out what the modifier was...

## Analysis

```javascript
const chemicalX = n => n**2^n

for (let i in secretKey) {
    result[i] += chemicalX(modifier[i % modifier.length])
}
```

Looking at this, it looks like modifier is being used to add some spooky chemicalX stuff to the flag.

If we could figure out what the modifier was, we would be able to reverse it...

```javascript
const secretKey = "secretflag".split("").map(v => v.charCodeAt(0))
const modifier = secretKey.slice(0,8)
const result = secretKey
```

So the flag is being split into an array of charCodes, modifier is made up of the first 8 letters of the flag.

Using our big brain, and knowing that the flag is in the format `gnsCTF{...}`, we can infer the first 7 characters
are `gnsCTF{`.

We'll have to brute force the last character, but that wasn't so bad!

## Solution

Not too proud of my code, but...

```javascript
// sorry for the messy code ;^|
(() => {
    // fight chemicalX with chemicalX
    const chemicalX = n => n**2^n

    // brute force the last character
    for (let i="A".charCodeAt(0); i<"z".charCodeAt(0); i++) {
        const result = [10621, 12184, 13389, 4621, 7192, 5032, 15325, 13389, 10603, 12177, 13329, 4668, 7203, 5077, 15314, 13323, 10617, 12125, 13369, 4651, 7218, 5062, 15297, 13375, 10636, 12125, 13388, 4675, 7224, 5066, 15307, 13384, 10621, 12169, 13384, 4603, 7207, 5063, 15297, 13323, 10568, 12130, 13325, 4603, 7163, 5012, 15253, 13323, 10571, 12130, 13323, 4604, 7159, 5019, 15257, 13323, 10574, 12124, 13326, 4610, 7163, 5011, 15259, 13326, 10573, 12123, 13325, 4604, 7160, 5012, 15251, 13328, 10569, 12127, 13331, 4609, 7157, 5012, 15253, 13326, 10643]

        const modifier = ("gnsCTF{" + String.fromCharCode(i)).split("").map(v => v.charCodeAt(0))

        for (let i in result) {
            // after figuring out the last character, we can take out the bad chemicals!!!
            result[i] -= chemicalX(modifier[i % modifier.length])
        }

        console.log(`${String.fromCharCode(i)}: ${String.fromCharCode(...result)}`)
    }
})()
```

### Flag

`gnsCTF{sUg7r_sp1c3_and_ev3rything_n1ce_12831723158123971824871947132421635971234}`
