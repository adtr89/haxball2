const HaxballJS = require('haxball.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let roomLink = null;

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

HaxballJS.then((HBInit) => {
  const room = HBInit({
    roomName: "Soukromá místnost pro kolegy",
    maxPlayers: 16,
    public: false,  // Toto nastaví místnost jako soukromou
    token: HAXBALL_TOKEN  // Použití tokenu přímo v kódu
  });

  room.onRoomLink = (link) => {
    console.log('Room created successfully!');
    console.log('Room link:', link);
    roomLink = link;  // Uložíme odkaz pro pozdější použití
  };

  room.onPlayerJoin = (player) => {
    console.log(`${player.name} se připojil do místnosti`);
    room.sendChat("Vítejte v naší soukromé Haxball místnosti!");
  };

  // Zde můžete přidat další herní logiku
});
