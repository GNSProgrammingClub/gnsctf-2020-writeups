# Long Live The King

Points: 50

## Category

Rev

## Question

>Long live the king! [Source](./files/source.js), [result](./files/result.txt).

### Hint

>Flag is in the format gnsCTF{...}

## Analysis

The flag is being xor'd by the super long `exoar`. We just need to exoar it again to get the original back.

## Solution

```javascript
(() => {
    const secretKey = [35, 21, 86, 25, 107, 108, 69, 10, 91, 38, 81, 62, 1, 65, 50, 95, 87, 65, 93, 28, 42, 27, 11, 78, 21, 109, 79, 97, 80, 42, 85, 127, 107, 52, 59, 122, 108, 32, 37, 121, 115, 68, 105, 8, 6, 4, 77, 69, 32, 103, 8, 117, 86, 76, 107, 38, 23, 112]

    const exoar = "I used to rule the world Seas would rise when I gave the word Now in the morning, I sleep alone Sweep the streets I used to own I used to roll the dice Feel the fear in my enemy's eyes Listen as the crowd would sing Now the old king is dead! Long live the king! One minute I held the key Next the walls were closed on me And I discovered that my castles stand Upon pillars of salt and pillars of sand I hear Jerusalem bells are ringing Roman Cavalry choirs are singing Be my mirror, my sword and shield My missionaries in a foreign field For some reason I can't explain Once you go there was never, never an honest word And that was when I ruled the world It was a wicked and wild wind Blew down the doors to let me in Shattered windows and the sound of drums People couldn't believe what I'd become Revolutionaries wait For my head on a silver plate Just a puppet on a lonely string Oh, who would ever want to be king? I hear Jerusalem bells are ringing Roman Calvary choirs are singing Be my mirror, my sword and shield My missionaries in a foreign field For some reason I can't explain I know Saint Peter won't call my name Never an honest word But that was when I ruled the world Oh, oh, oh, oh, oh Oh, oh, oh, oh, oh Oh, oh, oh, oh, oh Oh, oh, oh, oh, oh Oh, oh, oh, oh, oh I hear Jerusalem bells are ringing Roman Calvary choirs are singing Be my mirror, my sword and shield My missionaries in a foreign field For some reason I can't explain I know Saint Peter won't call my name Never an honest word But that was when I ruled the world".split("").map(v => v.charCodeAt(0))

    const result = secretKey

    for (let i in exoar) {
        result[i % secretKey.length] = result[i % secretKey.length] ^ exoar[i]
    }

    console.log(result)
})()
```

### Flag

`gnsCTF{th7t_wasnT_S0_harD_2845862506384741458672650038861}`
