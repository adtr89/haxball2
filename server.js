const HaxballJS = require('haxball.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Haxball server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

HaxballJS.then((HBInit) => {
  const room = HBInit({
    roomName: "Můj Haxball Server",
    maxPlayers: 16,
    public: true,
    token: "thr1.AAAAAGbgOqY-37Kk2VOxmQ.TJa41m6Or0k" // Tento token získáte z https://www.haxball.com/headlesstoken
  });

  room.onPlayerJoin = (player) => {
    console.log(`${player.name} se připojil do místnosti`);
    room.sendChat("Vítejte v mé Haxball místnosti!");
  };

  // Zde můžete přidat další herní logiku
});
