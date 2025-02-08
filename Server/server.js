const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

let users = 0;

io.on("connection", async (socket) => {
    console.log("A user connected");
    users++;
    io.emit("user-count", users);

    socket.on('load-note', async () => {
        const note = await Note.findOne();
        if (note) {
            console.log("Existing note found, loading content.");
            socket.emit("load-note", note.content);
        }
    });

    socket.on("edit-note", async (content) => {
        await Note.findOneAndUpdate({}, { content }, { upsert: true });
        socket.broadcast.emit("update-note", content);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        users--;
        io.emit("user-count", users);
    });
});

server.listen(3001, () => console.log("Server running on port 3001"));
