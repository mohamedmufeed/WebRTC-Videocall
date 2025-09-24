# VideoCall App

A real-time video conferencing web application built with ** React, Vite, Node.js, and Socket.IO.**
Supports video/audio calls, screen sharing, and chat functionality with room-based connections.

---

## Tech Stack

**Frontend**
- React + TypeScript  
- Tailwind CSS   
- Lucide Icons

**Backend**
- Node.js + TypeScript + Express  
- Socket.IO

**Hosting**
- Frontend → Vercel  
- Backend → Render  

---

## Folder Structure

### Frontend (client/)
```bash
client/
├── src/
│ ├── assets/ # Images, icons
│ ├── components/ # Reusable UI components
│ ├── pages/ # App pages 
│ ├── hooks/ # Custom React hooks
│ ├── routes/ # App routes
│ ├── utils/ # Utility functions
│ └── main.tsx # Entry point

```

### Backend (server/)
```bash
****server/
├── src/
│ └── socket.ts # Socket config point****
│ └── server.ts # App entry point****

```
---

## Installation & Setup

## Features
```bash
Create or join a video call  instantly

Real-time video and audio communication

Screen sharing with seamless toggle back to camera

Local and remote camera on/off detection

Real-time chat messaging 

Connection status indicators (Connecting, Connected, Disconnected, ICE Checking, Failed)

```

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/videocall-app.git
cd videocall-app
```

#### 2. Install dependencies 
**Frontend**
```bash
cd ../client
npm install
```

**Backend**
```bash
cd server
npm install
```
#### 3. Setup environment variables

**Backend**
Create a `.env` file inside `server/`:
```bash
FRONT_END_URL="http://localhost:5173"
```
**Frontend**
Create a `.env` file inside `client/`:
```bash
VITE_API_URL=http://localhost:5001
```
#### Running the Project

**Backend**
```bash
cd server
npm run dev
npm start   
```
**Frontend**
```bash
cd client
npm run build
npm run dev
```
Open in browser: http://localhost:5173


### Hosted Links

Frontend (Vercel): https://videocall-coral.vercel.app/

### License

This project is licensed under the MIT License.
