import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function CollaborativeEditor() {
    const [text, setText] = useState("");
    const [users, setUsers] = useState(0);

    useEffect(() => {
        socket.emit("load-note");

        socket.on("load-note", (content) => {
            setText(content);
        });

        socket.on("update-note", (content) => {
            setText(content);
        });

        socket.on("user-count", (count) => {
            setUsers(count);
        });

        return () => {
            socket.off("load-note");
            socket.off("update-note");
            socket.off("user-count");
        };
    }, []);

    const handleChange = (e) => {
        const content = e.target.value;
        setText(content);
        socket.emit("edit-note", content);
    };

    return (
        <div className="page-container">
        <div className="editor-container">
            <h3 className="editor-title">Real-Time Collaborative Editor</h3>
            <p className="user-count">Users online: {users}</p>
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
