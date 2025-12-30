const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

let players = {};

io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);
    players[socket.id] = { x: 1, y: 1 };

    socket.on("move", (data) => {
        players[socket.id].x += data.x;
        players[socket.id].y += data.y;
        io.emit("updatePlayers", players);
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
