# Circles!
Points: 500

## Category
Web

## Question
>Welcome to [osu!](http://shell.gnsctf.ml:3000/) (Capture the flags) [Server Code Source](files/server.js)

### Hint
>I don't think any human could do this, so don't try.
>
>Client files can be edited, right?
>
>This game runs at 60fps, so we increment frames using a certain special number.
>
>Don't overcomplicate your solution, the answer to bypassing the pesky anti-cheat is in the server code.

## Analysis

Before we go into the actual solution, let's first explore how the code works to get a better sense of what it is doing.

We can see two different script files that will be of use.
One is the [client side code](files/index.js), which can be viewed in chrome developer tools.
The other is the [server side code](files/server.js), which can be downloaded from the link in the channel description.

The first important thing to notice is the use of a library called [socket.io](https://socket.io/), which works as a communication library between the client and the server.

Both the client and server can send and receive events using the `socket.emit()` and `socket.on()` functions.

The three most important events used in the code are listed below:
```
frame (server -> client): Sends a message from the server to the client indicating that the next frame should be processed.
cursor (client -> server): Sends a message from the client to the server with the current cursor location.
click (client -> server): Sends a message from the client to the server that it wants to click.
```

So at the beginning of the game, after a few things are done to make sure the user knows where the circles will be and what time they should appear, the server begins sending frame events to the client.

At this time, the client can move their cursor and click any keys on their keyboard to send cursor and click events to the server.

```js
document.body.onmousemove = e => {
    const x = e.clientX;
    const y = e.clientY;
    // This may be useful ;)
    socket.emit("CURSOR", x / WIDTH_SCALAR, y / HEIGHT_SCALAR);
}

document.addEventListener('keypress', () => {
    // This too...
    socket.emit("CLICK");
}
```

The server side is a bit more interesting, from it we can see the different conditions in which the client can lose/win the game.

MISS (the frame of the current unhit circle is no longer in the acceptable hit window (OD * 20)):
```js
// Check if circle is missed
if(beatmap[nonHitCircleIndex] && beatmap[nonHitCircleIndex].frame < (frameIndex - OD * 20)) {
	socket.emit("FAIL", "You hit too late/missed!");
	socket.disconnect(true);
	return;
}
```

TOO EARLY (the circle was hit before it could be seen (((11 - AR) * 100))):
```js
if((currentNonHitCircle.frame - frameIndex) <= ((11 - AR) * 100)) {
	socket.emit("FAIL", "You hit too early!");
	socket.disconnect(true);
	return;
}
```

ANTI-CHEAT: (the cursor moved more than 250 pixels):
```js
// Cheat Detection
if(prevCursorPos && Math.hypot(mouseX - prevCursorPos.x, mouseY - prevCursorPos.y) > 250) {
	socket.emit("CHEAT", "ANTI-CHEAT: Moved too quickly!");
	socket.disconnect(true);
	cheater = true;
	return;
}
```

The final thing to note is what counts as a circle hit:
```js
socket.on("CLICK", () => {
	// Check for circle hit
	const currentNonHitCircle = beatmap[nonHitCircleIndex];
	if(prevCursorPos && overlapPoint(currentNonHitCircle, prevCursorPos.x, prevCursorPos.y, CS))  {
		if(Math.abs(frameIndex - currentNonHitCircle.frame) <= (OD * 20)) {
			nonHitCircleIndex++;
		}
	}
});
```
All this basically means is that in order for a circle to be hit, the cursor needs to overlap with the circle within radius CS.
This click event has to occur when the current frame is close enough (OD * 20) to the circle hit frame.

This is really all that is needed, so let's get into the solution.

# Solution

From the above analysis we see that we will have to make a bot that moves to the next unhit circle (without moving more than 250 pixels each frame event), sends a click event within the hit window of OD * 20, and then repeats.

We will create a variable outside of the frame event handler to keep track of the next circle index. Everytime we successfully hit a circle, we will increment this index by 1. For convenience we can also create a variable to keep track of the actual next circle using the next circle index.

```js
let nextCircleIndex = 0;
let currentNonHitCircle = beatmap[nextCircleIndex];

// Some code here that checks if it is time to send a click event
socket.emit("CLICK");
nextCircleIndex++;
currentNonHitCircle = beatmap[nextCircleIndex];
```

Next we will want to make sure that the bot hits at the right time, to do so we can use the same if statement used in the server code to check if a click is inside the hit window.

```js
if (Math.abs(frameIndex - currentNonHitCircle.frame) <= (OD * 20)) {
    socket.emit("CLICK");
    nextCircleIndex++;
    currentNonHitCircle = beatmap[nextCircleIndex];
}
```

And that's it, at least for clicking. Now we have to make code for the movement of the bot, this is also pretty simple.

Let's make a variable outside of the frame event handler to keep track of the bot cursor's position. We will update this cursor position and then send it to the server each frame event.
```js
let cursor = {
    x: 0,
    y: 0
}

// Some code that calculates cursor position
socket.emit("CURSOR", cursor.x, cursor.y);
```

To calculate the updated cursor position, we will first have to find the direction the bot is supposed to move in.
To do this let's get the 2d vector between the current cursor position and the position of the next circle.
```js
let moveDir = {
    x: currentNonHitCircle.x - cursor.x,
    y: currentNonHitCircle.y - cursor.y
}
```

If we simply add the movement vector to the cursor position, the bot will teleport to each circle and trigger the anti-cheat. 
To make sure the bot does not trigger the anti-cheat, we will have to cap the magnitude of the movement vector to 250. (We will only do this if the magnitude is > 0 so we don't divide by 0)
```js
let moveMag = Math.hypot(moveDir.x, moveDir.y);
if(moveMag != 0) {
    moveDir.x /= moveMag;
    moveDir.x *= Math.min(moveMag, 250);
    moveDir.y /= moveMag;
    moveDir.y *= Math.min(moveMag, 250);
}
```

Finally let's add our final movement vector to our cursor position and send a cursor event
```js
cursor.x += moveDir.x;
cursor.y += moveDir.y;

socket.emit("CURSOR", cursor.x, cursor.y);
```

And that's it... well sort of, we have to actually run our script by editing the client source files.
The easiest way to do this is through chrome local overrides, but there are other ways as well.

Here is how to use chrome local overrides:
```
1. Create a folder under Developer Tools > Sources > Overrides
2. Chrome will ask for permission to the folder, click Allow
3. Edit the script file in Sources > Page then save (ctrl-s). A purple dot will indicate the file is saved locally.
```

Full solution script: [index.js](solution/index.js)

### Flag
`gnsCTF{4_f001_m00n5_n16ht}`