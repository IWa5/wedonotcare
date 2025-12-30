const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET","POST"] }
});

// Track connected players and their usernames
let players = {};

io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    // Default username
    players[socket.id] = { x: 1, y: 1, username: "Player" + Math.floor(Math.random() * 1000) };

    // Set username
    socket.on("setUsername", (name) => {
        if (players[socket.id]) {
            players[socket.id].username = name || players[socket.id].username;
            io.emit("updatePlayers", players);
        }
    });

    // Movement
    socket.on("move", (data) => {
        if (players[socket.id]) {
            players[socket.id].x += data.x;
            players[socket.id].y += data.y;
            io.emit("updatePlayers", players);
        }
    });

    // Chat
    socket.on("chatMessage", (msg) => {
        if (players[socket.id]) {
            io.emit("chatMessage", { username: players[socket.id].username, text: msg });
        }
    });

    // Disconnect
    socket.on("disconnect", () => { delete players[socket.id]; });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
