# PA3 Projects and Project Memberships

This application extends PA2 with project creation, project viewing,
and project membership management using React, Express, and MongoDB.

## Features

- Sign up and log in
- Create projects with a name, description, status, and registered project lead
- View projects and their lead usernames
- View and add project members
- Allow users to participate in multiple projects
- Reject duplicate memberships
- Remove non-lead members
- Automatically include project leads as members and prevent their removal

## Requirements

- Node.js and npm
- A MongoDB Atlas cluster
- A database user with read and write access
- Your current IP address allowed in Atlas Network Access

The backend uses the pa2 database and these collections:

- users
- Projects
- ProjectMemberships

Project leads and memberships are stored using MongoDB ObjectId references.
Project creation uses a transaction to save the project and lead membership together.

## Backend Setup

From the main project folder:

```bash
cd server
npm install
```

Create a file named .env inside server containing:

```env
MONGO_URI=your_mongodb_connection_string
```

Replace the placeholder with your MongoDB Atlas connection string.

Start the backend:

```bash
node server.js
```

The backend runs at http://localhost:9000.

## Frontend Setup

Open a second terminal in the main project folder:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

Keep both terminals running while using the application.

If PowerShell blocks npm.ps1, use npm.cmd instead of npm:

```powershell
npm.cmd install
npm.cmd run dev
```

## Using the Application

1. Create registered users through Sign Up.
2. Use Create Project to enter project details and select a lead.
3. Use View Projects to see saved projects.
4. Use Project Members to select a project and manage its members.

For demonstration, use at least three registered users and two projects.

## Configuration Files

The .env file and node_modules folders are excluded from Git.
Install dependencies separately in client and server after cloning.