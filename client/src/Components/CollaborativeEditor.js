import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./CollaborativeEditor.css"; // Import the CSS file

// Initialize a connection to the backend server using Socket.IO
const socket = io("https://edittogether-api.onrender.com");

export default function CollaborativeEditor() {
    // Initialize state variables for text, users count, and online status
    const [text, setText] = useState(localStorage.getItem("note") || "");
    const [users, setUsers] = useState(0);
    const [online, setOnline] = useState(true);

    useEffect(() => {
        // Emit an event to load the note when the component mounts
        socket.emit("load-note");

        // Listen for the 'load-note' event from the server to set the note content
        socket.on("load-note", (content) => {
            setText(content);
            localStorage.setItem("note", content); // Save note content to local storage
        });

        // Listen for 'update-note' event to update the note content from other users
        socket.on("update-note", (content) => {
            setText(content);
            localStorage.setItem("note", content); // Update local storage with the latest content
        });

        // Listen for 'user-count' event to update the number of users online
        socket.on("user-count", (count) => {
            setUsers(count);
        });

        // Handle the reconnection event to set the online status to true and sync local data
        socket.on("connect", () => {
            setOnline(true);
            const savedNote = localStorage.getItem("note");
            if (savedNote) {
                socket.emit("edit-note", savedNote); // Emit the saved note content to the server
            }
        });

        // Handle the disconnection event to set the online status to false
        socket.on("disconnect", () => {
            setOnline(false);
        });

        // Clean up event listeners when the component unmounts
        return () => {
            socket.off("load-note");
            socket.off("update-note");
            socket.off("user-count");
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    // Handle changes to the text area input
    const handleChange = (e) => {
        const content = e.target.value;
        setText(content);
        localStorage.setItem("note", content); // Save the note content to local storage
        socket.emit("edit-note", content); // Emit the updated content to the server
    };

    // Render the collaborative editor UI
    return (
        <div className="page-container">
            <div className="editor-container">
                <h3 className="editor-title">Real-Time Collaborative Editor</h3>
                <p className="user-count">Users online: {users}</p>
                <p className={`status-indicator ${online ? "online" : "offline"}`}>
                    {online ? "You are online" : "You are offline"}
                </p>
                <textarea
                    className="editor-textarea"
                    value={text}
                    onChange={handleChange}
                    rows={10}
                    cols={50}
                ></textarea>
            </div>
        </div>
    );
}
