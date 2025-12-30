const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Socket.IO with proper CORS for any frontend
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Track connected players
let players = {};

io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);
    // Default starting position
    players[socket.id] = { x: 1, y: 1 };

    // When a player moves
    socket.on("move", (data) => {
        players[socket.id].x += data.x;
        players[socket.id].y += data.y;
        io.emit("updatePlayers", players);
    });

    // Player disconnects
    socket.on("disconnect", () => {
        delete players[socket.id];
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
