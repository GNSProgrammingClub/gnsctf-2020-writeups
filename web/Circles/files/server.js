const fs = require("fs");
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.port || 3000;
const SPEED_MULTIPLIER = 1;

const flag = process.env.flag || fs.readFileSync("./flag.txt").toString();

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
})
app.use('/client', express.static(__dirname + '/client'));

io.on('connection', async (socket) => {
	let cheater = false;

	// Process beatmap file as array
	let beatmap = await processMap("./Maps/map.txt");
	const {x: CS, y: OD, frame: AR} = beatmap[0];

	let nonHitCircleIndex = 1;
	let prevCursorPos;
	var frameIndex = 0;

	// Send MAP packet to client
	socket.emit("MAP", beatmap);

	socket.on("CURSOR", (mouseX, mouseY) => {
		// Cheat Detection
		if(prevCursorPos && Math.hypot(mouseX - prevCursorPos.x, mouseY - prevCursorPos.y) > 250) {
			socket.emit("CHEAT", "ANTI-CHEAT: Moved too quickly!");
			socket.disconnect(true);
			cheater = true;
			return;
		}

		prevCursorPos = {x: mouseX, y: mouseY};
	});

	socket.on("CLICK", () => {
		// Check for circle hit
		const currentNonHitCircle = beatmap[nonHitCircleIndex];
		if(prevCursorPos && overlapPoint(currentNonHitCircle, prevCursorPos.x, prevCursorPos.y, CS))  {
			if(Math.abs(frameIndex - currentNonHitCircle.frame) <= (OD * 20)) {
				nonHitCircleIndex++;
			} else if((currentNonHitCircle.frame - frameIndex) <= ((11 - AR) * 100)) {
				socket.emit("FAIL", "You hit too early!");
				socket.disconnect(true);
				return;
			}
		}
	});

	socket.on("HEARTBEAT", () => null);

	// When client receives map, start sending frame events
	socket.on("READY", async () => {
		for(; frameIndex <= 234663; frameIndex += 16.6666666667) {
			// I am bad at programming
			if(cheater) return;

			// Check if circle is missed
			if(beatmap[nonHitCircleIndex] && beatmap[nonHitCircleIndex].frame < (frameIndex - OD * 20)) {
				socket.emit("FAIL", "You hit too late/missed!");
				socket.disconnect(true);
				return;
			}
			socket.emit("FRAME");

			await sleep(16.6666666667 / SPEED_MULTIPLIER);
		}
		socket.emit("END");

		// If user played through the whole map without cheating or failing, send the flag.
		if(!cheater) socket.emit("FLAG", flag)
	})
})

// Start listening for client connections.
http.listen(PORT, () => {
	console.log(`Challenge "Circles!" starting on port ${PORT}`);
})

// Helper functions
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function overlapPoint(circlePos, x, y, CS) {
	return Math.hypot(circlePos.x - x, circlePos.y - y) <= CS * 10;
}

async function processMap(mapFile) {
	const beatmapData = await fs.readFileSync(mapFile, 'utf-8', (err) => console.error(`Error reading file ${mapFile} (${err})`))
	return beatmapData.split("\n").map(hitObject => {
		const hitObjectArr = hitObject.split(",");
		return {
			x: hitObjectArr[0],
			y: hitObjectArr[1],
			frame: hitObjectArr[2]
		};
	});	
}