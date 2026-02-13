# Project Setup and Run Instructions

This project consists of a Node.js/Express backend (`server`) and a React/Vite frontend (`client`).

## Prerequisites

- Node.js installed (v16+ recommended)
- npm or yarn

## 1. Setting up the Server

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  (Optional) Seed the database if this is the first run:
    ```bash
    node setup-all-users.js
    # or
    node seed-admin.js
    ```
4.  Start the server:
    ```bash
    node index.js
    ```
    The server typically runs on port 5000 (check console output).
    
    *Note: The server is configured to use SQLite (`database.sqlite`) by default, so no external database setup is required.*

## 2. Setting up the Client

1.  Open a new terminal and navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The client will typically run on http://localhost:5173.

## 3. Accessing the Application

Open your browser and navigate to the URL shown in the client terminal (e.g., `http://localhost:5173`).
