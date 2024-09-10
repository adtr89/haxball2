const HaxballJS = require('haxball.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

let roomLink = null;
let room = null;

app.get('/', (req, res) => {
  if (roomLink) {
    res.send(`Haxball server is running! Room link: ${roomLink}`);
  } else {
    res.send('Haxball server is running, but the room is not created yet.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// VAROVÁNÍ: Ukládání tokenu přímo v kódu není bezpečné pro produkční prostředí.
// Pro produkci použijte proměnné prostředí nebo bezpečný systém správy tajných klíčů.
const HAXBALL_TOKEN = "thr1.AAAAAGbgOqY-37Kk2VOxmQ.TJa41m6Or0k";

function createRoom() {
  HaxballJS.then((HBInit) => {
    room = HBInit({
      roomName: "Soukromá místnost pro kolegy",
      maxPlayers: 16,
      public: false,
      token: HAXBALL_TOKEN
    });

    room.onRoomLink = (link) => {
      console.log('Room created successfully!');
      console.log('Room link:', link);
      roomLink = link;
    };

    room.onPlayerJoin = (player) => {
      console.log(`${player.name} se připojil do místnosti`);
      room.sendChat("Vítejte v naší soukromé Haxball místnosti!");
    };

    room.onConnectionError = (error) => {
      console.error('Connection error:', error);
    };

    // Automatické obnovení místnosti při odpojení
    room.onRoomDestroy = () => {
      console.log('Room was destroyed. Attempting to recreate...');
      setTimeout(createRoom, 10000);  // Pokus o obnovení po 10 sekundách
    };
  }).catch((error) => {
    console.error('Error initializing Haxball room:', error);
    setTimeout(createRoom, 10000);  // Pokus o obnovení po 10 sekundách
  });
}

createRoom();

// Pravidelné obnovení tokenu (každých 23 hodin)
setInterval(() => {
  console.log('Attempting to refresh the token and recreate the room...');
  // Zde byste implementovali logiku pro získání nového tokenu
  // HAXBALL_TOKEN = getNewToken();
  if (room) {
    room.destroy();
  }
  createRoom();
}, 23 * 60 * 60 * 1000);
