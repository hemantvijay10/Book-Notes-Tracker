# Quick Setup Guide

Author: Hemant Vijay
Last Updated: 3-Nov-2025

This is a quick reference guide for setting up the Book Notes Tracker application.

## Prerequisites

Before you begin, make sure you have installed:

1. Node.js version 14 or higher
2. PostgreSQL version 12 or higher
3. npm package manager (comes with Node.js)

## Quick Start Steps

### Step 1: Install Dependencies

Open terminal in the project folder and run:

```
npm install
```

Wait for all packages to download and install.

### Step 2: Create Database

Open PostgreSQL command line or pgAdmin and run:

```
CREATE DATABASE book_notes;
```

Then run the schema file to create tables:

```
psql -U postgres -d book_notes -f schema.sql
```

Or manually copy the SQL commands from schema.sql into your PostgreSQL client.

### Step 3: Configure Database Password

Open index.js file and find this section around line 26:

```
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book_notes",
  password: "your_password_here",
  port: 5432,
});
```

Change "your_password_here" to your actual PostgreSQL password.

### Step 4: Start the Server

Run this command:

```
npm start
```

Or for development with auto-restart:

```
npm run dev
```

### Step 5: Open in Browser

Go to:

```
http://localhost:3000
```

You should see the Book Notes Tracker home page.

## Common Issues

### Database Connection Error

Make sure PostgreSQL is running and the password in index.js is correct.

### Port 3000 Already in Use

Either stop the other application using port 3000, or change the port number in index.js at line 22.

### Module Not Found Error

Run npm install again to make sure all dependencies are installed.

## Next Steps

1. Click "Add Book" to add your first book
2. Try different sorting options (Recency, Rating, Title)
3. Click on a book to see full details
4. Edit or delete books as needed

## Project Credit

This project is part of Angela Yu's Complete Web Development Bootcamp.
Course URL: https://www.udemy.com/course/the-complete-web-development-bootcamp/learn/lecture/40325688#overview

Enjoy tracking your reading journey!
