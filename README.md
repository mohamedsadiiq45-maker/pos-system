# Simple POS System

This is a simple Point of Sale system built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## Features

- Login/Logout
- Manage Categories
- Manage Products
- Manage Sales
- Manage Suppliers
- Stock Monitoring (Inventory)
- Manage System Users
- Generate Sales Report

## Prerequisites

- Node.js (v18 or higher)
- npm

## Getting Started

1.  **Install dependencies:**

    Run the following command in the root directory of the project to install all the necessary dependencies for both the client and the server.

    ```bash
    npm install
    ```

2.  **Set up the database:**

    The application uses a SQLite database. To set up the database and apply the schema, run the following commands in the `packages/server` directory.

    ```bash
    cd packages/server
    npx prisma db push
    ```

3.  **Seed the database:**

    To populate the database with some initial data, run the following command in the `packages/server` directory.

    ```bash
    npx prisma db seed
    ```

    This will create a default user with the following credentials:
    - **Email:** `admin@example.com`
    - **Password:** `password123`

4.  **Run the application:**

    To run both the client and the server concurrently, run the following command in the root directory of the project.

    ```bash
    npm run dev
    ```

    The client will be available at `http://localhost:5173` and the server at `http://localhost:3001`.

## Project Structure

The project is a monorepo with two packages:

-   `packages/client`: The React frontend application.
-   `packages/server`: The Node.js/Express backend application.

Each package has its own `package.json` file with its own dependencies and scripts. The root `package.json` file contains scripts to run both the client and the server concurrently.
