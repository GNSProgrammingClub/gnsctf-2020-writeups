# Blast To The Past 1
Points: 200

## Category
OSINT

## Question
Let's visit the front page of the in-- GNSHS

## Hints
>It's on the internet
>
>The flag is in `gnsctf{FLAG}` format

## Analysis

As [SentinelOne.com](https://www.sentinelone.com/blog/what-is-osint-how-is-it-used/) puts it best,"OSINT stands for open source intelligence, which refers to any information that can legally be gathered from free, public sources about an individual or organization." In OSINT problems, this entails scouring the internet to find flags. In this challenge's case, the task was to find a flag on reddit: the front page of the internet.

# Solution

While many people may have turned to [r/GNSHS](https://reddit.com/r/gnshs) to find the flag, the flag is actually on [u/GNSHS](https://reddit.com/user/gnshs). However, if you visit the account's profile, you are greeted with [this post](https://www.reddit.com/user/gnshs/comments/jc3qyl/gnsctf/) saying that the flag has been deleted.

One common method of recovering deleted content on the internet is using the Internet Archive's [Wayback Machine](https://archive.org/web/). The Wayback Machine is a service that allows people to go back in time and visit archived website pages.

If you plug in `https://reddit.com/user/gnshs` into the Wayback Machine, you will be greeted with a list of the account's deleted posts of which one of them contains the flag.

### Flag
`gnsctf{d3l3t3d_but_4rch1v3d}`
