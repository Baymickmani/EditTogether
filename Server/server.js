// Import necessary modules
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./db");
require("dotenv").config();

// Create an Express application
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server and allow cross-origin requests
const io = new Server(server, { cors: { origin: "*" } });

// Configure Mongoose to use the new URL parser and unified topology
mongoose.set('strictQuery', false);

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB")) // Log success message on successful connection
    .catch(err => console.error("MongoDB connection error:", err)); // Log error message on connection failure

// Initialize a variable to keep track of the number of connected users
let users = 0;

// Listen for incoming Socket.IO connections
io.on("connection", async (socket) => {
    console.log("A user connected");
    users++; // Increment the user count
    io.emit("user-count", users); // Emit the updated user count to all clients

    // Listen for 'load-note' event from the client to load the note content
    socket.on('load-note', async () => {
        const note = await Note.findOne(); // Retrieve the note from the database
        if (note) {
            console.log("Existing note found, loading content.");
            socket.emit("load-note", note.content); // Send the note content to the client
        }
    });

    // Listen for 'edit-note' event from the client to update the note content
    socket.on("edit-note", async (content) => {
        await Note.findOneAndUpdate({}, { content }, { upsert: true }); // Update the note in the database
        socket.broadcast.emit("update-note", content); // Broadcast the updated note content to other clients
    });

    // Listen for 'disconnect' event when a user disconnects
    socket.on('disconnect', () => {
        console.log('user disconnected');
        users--; // Decrement the user count
        io.emit("user-count", users); // Emit the updated user count to all clients
    });
});

// Start the server on port 3001 and log a message indicating that the server is running
server.listen(3001, () => console.log("Server running on port 3001"));
