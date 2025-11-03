# Book Notes Tracker

A web application for tracking books you have read with personal notes and ratings. This project allows you to maintain a reading list with detailed information about each book, including cover images, ratings, notes, and sorting capabilities.

## Project Credit

This project was created as part of Angela Yu's Complete Web Development Bootcamp.

Course URL: https://www.udemy.com/course/the-complete-web-development-bootcamp/learn/lecture/40325688#overview

Author: Hemant Vijay

Last Updated: 3 Nov 2025

## Features

The application provides the following features:

1. View all books in your reading list with cover images from Open Library API
2. Add new books with title, author, ISBN, rating, date read, and personal notes
3. Edit existing book entries to update information
4. Delete books from your reading list
5. Sort books by recency (most recently read), rating (highest rated), or title (alphabetically)
6. View detailed information about each book including full notes
7. Mobile responsive design that works on all devices

## Technologies Used

The project is built using:

1. Node.js: JavaScript runtime for server side code
2. Express.js: Web framework for routing and middleware
3. PostgreSQL: Database for storing book information
4. EJS: Templating engine for dynamic HTML pages
5. Axios: HTTP client for API requests
6. Body Parser: Middleware for parsing form data
7. Open Library Covers API: External API for fetching book cover images

## Database Schema

The application uses a PostgreSQL database with one main table:

Table: books
Columns:
  id: Unique identifier (auto generated)
  title: Book title (required)
  author: Book author (required)
  isbn: ISBN number for book cover lookup (optional)
  rating: Personal rating from 1 to 10 (optional)
  date_read: Date when you finished the book (optional)
  notes: Personal notes and thoughts about the book (optional)
  created_at: Timestamp when record was created
  updated_at: Timestamp when record was last modified

## Installation and Setup

Follow these steps to run the application on your local machine:

### Prerequisites

Make sure you have the following installed:
1. Node.js (version 14 or higher)
2. PostgreSQL (version 12 or higher)
3. npm (comes with Node.js)

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```
npm install
```

This will install all required packages listed in package.json including Express, EJS, pg, axios, and body parser.

### Step 2: Set Up the Database

1. Open PostgreSQL command line (psql) or use a PostgreSQL client like pgAdmin
2. Create a new database named book_notes:

```
CREATE DATABASE book_notes;
```

3. Connect to the database:

```
\c book_notes
```

4. Run the SQL commands from the schema.sql file to create the books table:

```
psql -U postgres -d book_notes -f schema.sql
```

Or copy and paste the contents of schema.sql into your PostgreSQL client.

### Step 3: Configure Database Connection

Open the index.js file and update the database connection settings with your PostgreSQL credentials:

```
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book_notes",
  password: "your_password_here",
  port: 5432,
});
```

Replace "your_password_here" with your actual PostgreSQL password.

### Step 4: Start the Server

Run the server using one of these commands:

For production:
```
npm start
```

For development (with automatic restart on file changes):
```
npm run dev
```

Note: The dev command requires nodemon to be installed. It is included in the package.json devDependencies.

### Step 5: Access the Application

Open your web browser and go to:

```
http://localhost:3000
```

You should see the Book Notes Tracker home page.

## Usage Guide

### Adding a Book

1. Click the "Add Book" button in the navigation bar
2. Fill in the form with book information
   Required fields: Title and Author
   Optional fields: ISBN, Rating, Date Read, Notes
3. Click "Add Book" to save
4. You will be redirected to the home page where you can see your new book

### Editing a Book

1. Click the "Edit" button on any book card
2. Update the information in the form
3. Click "Update Book" to save changes
4. You will be redirected to the home page with the updated information

### Deleting a Book

1. Click the "Delete" button on any book card
2. Confirm the deletion in the popup dialog
3. The book will be removed from your list

### Viewing Book Details

1. Click on the book title or "View Details" button
2. You will see the full information including complete notes
3. Click "Back to List" to return to the home page

### Sorting Books

Use the sorting buttons at the top of the home page:
1. Recency: Shows most recently read books first
2. Rating: Shows highest rated books first
3. Title: Shows books in alphabetical order by title

## API Integration

The application uses the Open Library Covers API to fetch book cover images:

API URL format: https://covers.openlibrary.org/b/isbn/ISBN-M.jpg

Where ISBN is the ISBN number you provide for each book. The API returns a medium sized cover image. If no ISBN is provided or the cover is not found, a placeholder image is shown.

## Project Structure

```
Project3/
├── index.js                  Main server file with routes
├── package.json              Project dependencies and scripts
├── schema.sql                Database schema definition
├── LICENSE.dat               MIT License file
├── README.md                 This file
├── views/                    EJS templates
│   ├── partials/
│   │   ├── header.ejs        Header component
│   │   └── footer.ejs        Footer component
│   ├── index.ejs             Home page with book list
│   ├── add.ejs               Add book form
│   ├── edit.ejs              Edit book form
│   └── book.ejs              Book detail page
└── public/                   Static files
    ├── styles/
    │   └── main.css          Stylesheet
    └── images/               Images (placeholder for no cover)
```

## Troubleshooting

### Database Connection Error

If you see an error about database connection:
1. Make sure PostgreSQL is running
2. Check that the database name, username, and password are correct in index.js
3. Verify that the book_notes database exists

### Port Already in Use

If port 3000 is already in use:
1. Stop any other application using port 3000
2. Or change the port number in index.js

### Book Covers Not Loading

If book covers are not showing:
1. Check that you have entered a valid ISBN number
2. Make sure you have internet connection to access the Open Library API
3. Some books may not have covers available in the API

## Future Enhancements

Possible features to add in the future:
1. Search functionality to find books by title or author
2. Filter by rating range or date range
3. Export book list to CSV or PDF
4. Add tags or categories for books
5. Add a reading progress tracker for books currently being read
6. User authentication to allow multiple users
7. Book recommendations based on your ratings
8. Integration with Goodreads or other book APIs

## License

This project is licensed under the MIT License. See LICENSE.dat for details.

The MIT License allows free use, modification, and distribution of this software.

## Contact

Author: Hemant Vijay

For questions or feedback about this project, please refer to the course community on Udemy.

## Acknowledgments

Special thanks to Angela Yu for creating the Complete Web Development Bootcamp and providing the inspiration for this project.

Derek Sivers for the original idea of maintaining a public book notes website at https://sive.rs/book

Open Library for providing the free Covers API.
