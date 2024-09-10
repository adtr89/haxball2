const HaxballJS = require('haxball.js');
const express = require('express');
const cors = require('cors');
const HttpsProxyAgent = require('https-proxy-agent');

const app = express();
const port = process.env.PORT || 10000;

// Proxy nastavení
const proxyUrl = process.env.HTTP_PROXY || 'http://proxy.replit.com:8080';
const agent = new HttpsProxyAgent(proxyUrl);
global.XMLHttpRequest = require('xhr2');
global.WebSocket = require('ws');

// Povolení CORS
app.use(cors());

let roomLink = null;
let room = null;

app.get('/', (req, res) => {
  if (roomLink) {
    res.send(`Haxball server is running on port ${port}! Room link: ${roomLink}`);
  } else {
    res.send(`Haxball server is running on port ${port}, but the room is not created yet.`);
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Express server is running on port ${port}`);
});

const HAXBALL_TOKEN = "thr1.AAAAAGbgje-wyQGIWTqo3A.zWwtOUQIsC8";

function createRoom() {
  console.log('Attempting to create Haxball room...');
  console.log('Current environment:', process.env.NODE_ENV);
  console.log('Current port:', port);

  HaxballJS.then((HBInit) => {
    console.log('HaxballJS loaded successfully');
    const config = {
      roomName: "Soukromá místnost pro kolegy",
      maxPlayers: 16,
      public: false,
      token: HAXBALL_TOKEN,
    };
    console.log('Room configuration:', config);

    room = HBInit(config);

    room.onRoomLink = (link) => {
      console.log('Room created successfully!');
      console.log('Room link:', link);
      roomLink = link;
    };

    room.onPlayerJoin = (player) => {
      console.log(`Player ${player.name} (ID: ${player.id}) joined the room`);
      room.sendChat("Vítejte v naší soukromé Haxball místnosti!");
    };

    room.onPlayerLeave = (player) => {
      console.log(`Player ${player.name} (ID: ${player.id}) left the room`);
    };

    room.onConnectionError = (error) => {
      console.error('Connection error occurred:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    };

    // Další event handlery...

  }).catch((error) => {
    console.error('Error initializing Haxball room:', error);
    setTimeout(createRoom, 10000);
  });
}

createRoom();

// Pravidelné logování stavu místnosti
setInterval(() => {
  if (room) {
    console.log('Current room state:');
    console.log('Players:', room.getPlayerList().length);
    console.log('Game in progress:', room.getScores() !== null);
  } else {
    console.log('Room is not initialized');
  }
}, 60000); // Každou minutu

// Přidáme endpoint pro zobrazení aktuálního stavu
app.get('/status', (req, res) => {
  if (room) {
    res.json({
      roomLink: roomLink,
      players: room.getPlayerList().length,
      gameInProgress: room.getScores() !== null
    });
  } else {
    res.json({ status: 'Room not initialized' });
  }
});
