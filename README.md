**EditTogether Documentation**

**Introduction**

EditTogether is a web-based application that allows multiple users to edit a shared document simultaneously in real-time. The application is built using React for the frontend and Node.js for the backend, with Socket.IO facilitating real-time communication. MongoDB is used as the database to store the document content.

**Features**

- Real-time collaboration: Multiple users can edit the document simultaneously.
- User count: Displays the number of users currently online.
- Online/Offline status: Indicates whether the user is connected to the server.
- Persistent storage: The document content is saved in MongoDB and can be retrieved when users reconnect.

**Technologies Used**

- Frontend: React, Socket.IO-client
- Backend: Node.js, Express, Socket.IO, MongoDB
- Database: MongoDB
- Hosting: Render (https://edittogether-api.onrender.com)

**Application URL**

[https://edittogether.onrender.com](https://edittogether.onrender.com)

**GitHub Repository**

[https://github.com/Baymickmani/EditTogether](https://github.com/Baymickmani/EditTogether)

**Application Flow**

1. **Frontend Initialization**:
   - The frontend initializes a connection to the backend server using Socket.IO.
   - The frontend emits an event to load the document content when the component mounts.

2. **Backend Initialization**:
   - The backend listens for incoming connections using Socket.IO.
   - When a connection is established, the backend retrieves the document content from MongoDB and sends it to the client.

3. **Real-Time Editing**:
   - When a user makes changes to the document, the frontend emits an event to update the document content on the server.
   - The backend listens for this event, updates the document content in MongoDB, and broadcasts the updated content to other clients.

4. **User Count**:
   - The backend keeps track of the number of connected users and emits this count to all clients whenever a user connects or disconnects.

**Algorithms Used**

- **Operational Transformation (OT)**: The real-time collaboration is facilitated using an algorithm called Operational Transformation (OT). OT ensures that concurrent edits from multiple users are merged consistently and that all users see the same final document. When a user makes an edit, the change is transformed and applied locally, then sent to the server, which broadcasts the update to other clients. Each client applies the transformation to their local copy of the document, ensuring consistency across all clients.

**Offline Synchronization**

- **Reconnection Handling**: When a user goes offline, their changes are saved locally in the browser's local storage. Upon reconnection, the client emits an event to synchronize the local data with the server. If there are any changes made while the user was offline, these changes are sent to the server, and the server broadcasts the updated content to other clients. This ensures that the user's changes are not lost, and the document is kept consistent.

**Steps to Run the Application**

**Frontend (Client)**

1. **Clone the Repository**:
   ```
   git clone https://github.com/Baymickmani/EditTogether.git
   cd EditTogether/client
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Run the Application**:
   ```
   npm start
   ```
   This will start the React development server, and the application will be available at `http://localhost:3000`.

**Backend (Server)**

1. **Clone the Repository** (if not already done):
   ```
   git clone https://github.com/Baymickmani/EditTogether.git
   cd EditTogether/server
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the `server` directory and add the following:
   ```
   MONGO_URI=your-mongodb-connection-string
   ```

4. **Run the Server**:
   ```
   node server.js
   ```
   This will start the backend server on port 3001.

**User Interface**

- The editor displays the document content in a textarea element.
- The number of users online is displayed above the editor.
- The online/offline status is indicated with a message below the user count.
