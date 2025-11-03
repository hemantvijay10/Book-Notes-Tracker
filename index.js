// Book Notes Tracker - Main Server File
// Author: Hemant Vijay
// Last Updated: 3-Nov-2025
// Project Credit: This project is part of Angela Yu's Complete Web Development Bootcamp
// Course URL: https://www.udemy.com/course/the-complete-web-development-bootcamp/learn/lecture/40325688#overview

// Import required Node.js modules
// express: Web framework for creating the server and handling routes
// body-parser: Middleware to parse incoming request bodies
// pg: PostgreSQL client for database operations
// axios: HTTP client for making API requests to fetch book covers
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

// Create an Express application instance
const app = express();

// Set the port number for the server
// The server will listen on port 3000
const port = 3000;

// Configure PostgreSQL database connection
// This connects to your local PostgreSQL database
const db = new pg.Client({
  user: "postgres",        // Your PostgreSQL username
  host: "localhost",       // Database server location (local machine)
  database: "book_notes",  // Name of the database we created
  password: "your_password_here",  // Your PostgreSQL password (change this)
  port: 5432,              // Default PostgreSQL port
});

// Connect to the database
// This establishes the connection when the server starts
db.connect();

// Middleware setup
// body-parser middleware allows us to read data from HTML forms
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, images, etc.) from the 'public' folder
app.use(express.static("public"));

// Set EJS as the templating engine
// EJS allows us to create dynamic HTML pages
app.set("view engine", "ejs");

// Helper function to fetch book cover image from Open Library API
// This function takes an ISBN and returns the URL for the book cover
async function getBookCover(isbn) {
  // If no ISBN is provided, return a placeholder image
  if (!isbn) {
    return "/images/no-cover.svg";
  }

  // The Open Library Covers API URL format
  // We use the ISBN to get the book cover in medium size
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
}

// Route: GET /
// This is the home page route
// It displays all books, with optional sorting
app.get("/", async (req, res) => {
  try {
    // Get the sort parameter from the URL query string
    // Default sort is by most recent date read
    const sortBy = req.query.sort || "recency";

    // Build the SQL query based on the sort option
    let query = "SELECT * FROM books";

    // Add ORDER BY clause based on user selection
    if (sortBy === "rating") {
      // Sort by highest rating first
      query += " ORDER BY rating DESC, title ASC";
    } else if (sortBy === "title") {
      // Sort alphabetically by title
      query += " ORDER BY title ASC";
    } else {
      // Sort by most recent read first (default)
      query += " ORDER BY date_read DESC NULLS LAST, created_at DESC";
    }

    // Execute the database query
    const result = await db.query(query);

    // Get all books from the query result
    const books = result.rows;

    // Add book cover URLs to each book object
    for (let book of books) {
      book.coverUrl = await getBookCover(book.isbn);
    }

    // Render the index page with the books data
    // Pass the books array and current sort option to the template
    res.render("index", {
      books: books,
      sortBy: sortBy
    });

  } catch (err) {
    // If there is an error, log it to the console
    console.error("Error fetching books:", err);
    // Send an error response to the user
    res.status(500).send("Error loading books. Please try again.");
  }
});

// Route: GET /add
// This route displays the form to add a new book
app.get("/add", (req, res) => {
  // Render the add book page
  res.render("add");
});

// Route: POST /add
// This route handles the form submission for adding a new book
app.post("/add", async (req, res) => {
  try {
    // Extract book data from the form submission
    const { title, author, isbn, rating, date_read, notes } = req.body;

    // Validate that required fields are provided
    if (!title || !author) {
      return res.status(400).send("Title and Author are required fields.");
    }

    // Insert the new book into the database
    // The RETURNING clause gives us back the inserted row
    const query = `
      INSERT INTO books (title, author, isbn, rating, date_read, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    // Execute the insert query with the form data
    // Using parameterized queries prevents SQL injection
    await db.query(query, [
      title,
      author,
      isbn || null,              // Use null if ISBN is not provided
      rating || null,            // Use null if rating is not provided
      date_read || null,         // Use null if date is not provided
      notes || null              // Use null if notes are not provided
    ]);

    // Redirect back to the home page to see the new book
    res.redirect("/");

  } catch (err) {
    // If there is an error, log it to the console
    console.error("Error adding book:", err);
    // Send an error response to the user
    res.status(500).send("Error adding book. Please try again.");
  }
});

// Route: GET /edit/:id
// This route displays the form to edit an existing book
// The :id is a route parameter that captures the book's ID
app.get("/edit/:id", async (req, res) => {
  try {
    // Get the book ID from the URL parameter
    const bookId = req.params.id;

    // Fetch the book from the database using its ID
    const result = await db.query("SELECT * FROM books WHERE id = $1", [bookId]);

    // Check if the book exists
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found.");
    }

    // Get the book data
    const book = result.rows[0];

    // Format the date for the HTML date input field
    // The date input expects YYYY-MM-DD format
    if (book.date_read) {
      const date = new Date(book.date_read);
      book.date_read = date.toISOString().split('T')[0];
    }

    // Render the edit page with the book data
    res.render("edit", { book: book });

  } catch (err) {
    // If there is an error, log it to the console
    console.error("Error fetching book for edit:", err);
    // Send an error response to the user
    res.status(500).send("Error loading book. Please try again.");
  }
});

// Route: POST /edit/:id
// This route handles the form submission for updating a book
app.post("/edit/:id", async (req, res) => {
  try {
    // Get the book ID from the URL parameter
    const bookId = req.params.id;

    // Extract updated book data from the form submission
    const { title, author, isbn, rating, date_read, notes } = req.body;

    // Validate that required fields are provided
    if (!title || !author) {
      return res.status(400).send("Title and Author are required fields.");
    }

    // Update the book in the database
    const query = `
      UPDATE books
      SET title = $1, author = $2, isbn = $3, rating = $4,
          date_read = $5, notes = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
    `;

    // Execute the update query
    await db.query(query, [
      title,
      author,
      isbn || null,
      rating || null,
      date_read || null,
      notes || null,
      bookId
    ]);

    // Redirect back to the home page to see the updated book
    res.redirect("/");

  } catch (err) {
    // If there is an error, log it to the console
    console.error("Error updating book:", err);
    // Send an error response to the user
    res.status(500).send("Error updating book. Please try again.");
  }
});

// Route: POST /delete/:id
// This route handles deleting a book
app.post("/delete/:id", async (req, res) => {
  try {
    // Get the book ID from the URL parameter
    const bookId = req.params.id;

    // Delete the book from the database
    await db.query("DELETE FROM books WHERE id = $1", [bookId]);

    // Redirect back to the home page
    res.redirect("/");

  } catch (err) {
    // If there is an error, log it to the console
    console.error("Error deleting book:", err);
    // Send an error response to the user
    res.status(500).send("Error deleting book. Please try again.");
  }
});

// Route: GET /book/:id
// This route displays the full details of a single book
app.get("/book/:id", async (req, res) => {
  try {
    // Get the book ID from the URL parameter
    const bookId = req.params.id;

    // Fetch the book from the database
    const result = await db.query("SELECT * FROM books WHERE id = $1", [bookId]);

    // Check if the book exists
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found.");
    }

    // Get the book data
    const book = result.rows[0];

    // Add the book cover URL
    book.coverUrl = await getBookCover(book.isbn);

    // Render the book detail page
    res.render("book", { book: book });

  } catch (err) {
    // If there is an error, log it to the console
    console.error("Error fetching book details:", err);
    // Send an error response to the user
    res.status(500).send("Error loading book details. Please try again.");
  }
});

// Start the server
// The server will listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
