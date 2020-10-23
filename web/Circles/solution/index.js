// Set up canvas constants and audio
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const WIDTH_SCALAR = WIDTH / 640;
const HEIGHT_SCALAR = HEIGHT / 480;
const c = document.getElementById("ctx");
c.width = WIDTH
c.height = HEIGHT
/** @type {CanvasRenderingContext2D} */
const canvas = c.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;
const audio = document.getElementById("audio");
const hitSound = document.getElementById("hitSound");
audio.playbackRate = 1;
audio.volume = 0.15;
hitSound.volume = 0.25;

// Connect to socket.io
const socket = io.connect();
socket.heartbeatTimeout = 2000000000;

// Set up cursor and background
var cursorImg = document.getElementById("cursor");
var backgroundImg = document.getElementById("background");
document.body.style.cursor = "none";

// Run when map is retrived from server
socket.on("MAP", beatmap => {
    // Set up beatmap stats
    const { x: CS, y: OD, frame: AR } = beatmap.shift();
    var frameIndex = 0;

    // Draw the instructions to play on the canvas
    canvas.fillStyle = "pink";
    canvas.fillRect(0, 0, canvas.width, canvas.height);
    canvas.font = "100px Serif";
    canvas.textAlign = "center";
    canvas.textBaseline = "middle";
    canvas.fillStyle = "white";
    canvas.fillText("Welcome to Circles!", WIDTH / 2, HEIGHT / 3)
    canvas.font = "50px Serif";
    canvas.fillText("[Click here to start]", WIDTH / 2, HEIGHT / 2)
    canvas.font = "20px Serif";
    canvas.fillText("Aim using your mouse, use any keys on your keyboard to click. Aim your cursor onto the circles and time your clicks to the beat!", WIDTH / 2, HEIGHT * (2 / 3))

    // Set up end screen event listeners that draw the correct end screen on the canvas
    socket.on("END", () => {
        canvas.fillStyle = "black";
        canvas.fillRect(0, 0, canvas.width, canvas.height);
    });
    socket.on("FAIL", msg => {
        canvas.fillStyle = "red";
        canvas.fillRect(0, 0, canvas.width, canvas.height);
        canvas.font = "100px Serif";
        canvas.textAlign = "center";
        canvas.textBaseline = "middle";
        canvas.fillStyle = "black";
        canvas.fillText(msg, WIDTH / 2, HEIGHT / 2)
        audio.pause();
        audio.currentTime = 0;
    });
    socket.on("CHEAT", msg => {
        canvas.fillStyle = "yellow";
        canvas.fillRect(0, 0, canvas.width, canvas.height);
        canvas.font = "100px Serif";
        canvas.textAlign = "center";
        canvas.textBaseline = "middle";
        canvas.fillStyle = "black";
        canvas.fillText(msg, WIDTH / 2, HEIGHT / 2)
        audio.pause();
        audio.currentTime = 0;
    });

    // Don't get too caught up on this function, the vulnerability is not here.
    // This function will only be called when the server knows the client has completed the beatmap without failing or cheating.
    socket.on("FLAG", flag => {
        canvas.fillStyle = "green";
        canvas.fillRect(0, 0, canvas.width, canvas.height);
        canvas.font = "100px Serif";
        canvas.textAlign = "center";
        canvas.textBaseline = "middle";
        canvas.fillStyle = "black";
        canvas.fillText(flag, WIDTH / 2, HEIGHT / 2)
        audio.pause();
        audio.currentTime = 0;
    });

    // BOT VARS
    let nextCircleIndex = 0;
    let currentNonHitCircle = beatmap[nextCircleIndex];
    let cursor = {
        x: 0,
        y: 0
    }

    // Run this every frametick (16.6666666667 ms).
    //The exact time may lag behind the music because the server handles when a client should move to the next frametick.
    socket.on("FRAME", () => {
        // BOT CODE
        let moveDir = {
            x: currentNonHitCircle.x - cursor.x,
            y: currentNonHitCircle.y - cursor.y
        }

        let moveMag = Math.hypot(moveDir.x, moveDir.y);
        if (moveMag != 0) {
            moveDir.x /= moveMag;
            moveDir.x *= Math.min(moveMag, 140);
            moveDir.y /= moveMag;
            moveDir.y *= Math.min(moveMag, 140);
        }

        cursor.x += moveDir.x;
        cursor.y += moveDir.y;

        socket.emit("CURSOR", cursor.x, cursor.y);

        if (Math.abs(frameIndex - currentNonHitCircle.frame) <= (OD * 20)) {
            socket.emit("CLICK");
            nextCircleIndex++;
            currentNonHitCircle = beatmap[nextCircleIndex];
        }

        // Draw the background first, and then the circles on top of it.
        canvas.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

        canvas.drawImage(cursorImg, cursor.x * WIDTH_SCALAR - 64, cursor.y * HEIGHT_SCALAR - 64)

        canvas.strokeStyle = "white";
        // Get all circles between the current frameIndex and a value related to the approach rate of the beatmap.
        const visibleHitObjs = beatmap.filter(hitObj => hitObj.frame >= frameIndex && hitObj.frame < (frameIndex + (11 - AR) * 100));

        if (visibleHitObjs[0]) {
            // Loop over all visible hit circles, drawing them on the canvas along with their approach circles.
            visibleHitObjs.forEach(hitObj => {
                canvas.beginPath();
                canvas.ellipse(hitObj.x * WIDTH_SCALAR, hitObj.y * HEIGHT_SCALAR, CS * 10 * WIDTH_SCALAR, CS * 10 * HEIGHT_SCALAR, 0, 0, Math.PI * 2);
                canvas.stroke();

                canvas.beginPath();
                canvas.ellipse(hitObj.x * WIDTH_SCALAR, hitObj.y * HEIGHT_SCALAR, WIDTH_SCALAR * (((hitObj.frame - frameIndex) / ((11 - AR) * 100)) * 150 + CS * 10), HEIGHT_SCALAR * (((hitObj.frame - frameIndex) / ((11 - AR) * 100)) * 150 + CS * 10), 0, 0, Math.PI * 2);
                canvas.stroke();
            });

            // Mumbo, jumbo... I don't know why this works but it draws the follow lines between each hit circle.
            canvas.beginPath();
            canvas.moveTo(visibleHitObjs[0].x * WIDTH_SCALAR, visibleHitObjs[0].y * HEIGHT_SCALAR);
            visibleHitObjs.shift();
            visibleHitObjs.forEach(hitObj => {
                canvas.lineTo(hitObj.x * WIDTH_SCALAR, hitObj.y * HEIGHT_SCALAR);
            });
            canvas.stroke();
        }

        // Send a heartbeat packet back to the server to keep the connection alive.
        socket.emit("HEARTBEAT");

        // Once frame is processed, increment frameIndex by the length of a frametick.
        frameIndex += 16.6666666667;
    });

    // Set up event listeners for user input
    document.body.onmousedown = () => {
        socket.emit("READY");
        audio.play();
        document.body.onmousedown = () => null;
    }

    var enableHandler = true;
    document.body.onmousemove = e => {
        if (enableHandler) {
            const x = e.clientX;
            const y = e.clientY;
            // This may be useful ;)
            //socket.emit("CURSOR", x / WIDTH_SCALAR, y / HEIGHT_SCALAR);
            enableHandler = false;
        }
    }

    var timer = window.setInterval(function () {
        enableHandler = true;
    }, 16.6666666667);

    document.addEventListener('keypress', () => {
        // This too...
        //socket.emit("CLICK");
        hitSound.pause();
        hitSound.currentTime = 0;
        hitSound.play();
    });
});
