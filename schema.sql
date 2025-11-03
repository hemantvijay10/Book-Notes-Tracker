-- Book Notes Tracker Database Schema
-- Author: Hemant Vijay
-- Last Updated: 3-Nov-2025
-- Project Credit: This project is part of Angela Yu's Complete Web Development Bootcamp
-- Course URL: https://www.udemy.com/course/the-complete-web-development-bootcamp/learn/lecture/40325688#overview

-- This schema creates the database structure for storing book information
-- The books table will hold all the data about books you have read

-- First, create the database (run this from psql command line)
-- CREATE DATABASE book_notes;

-- Then connect to the database
-- \c book_notes

-- Drop the table if it exists to start fresh (be careful with this in production)
DROP TABLE IF EXISTS books;

-- Create the books table
-- This table stores information about each book you have read
CREATE TABLE books (
    -- id: A unique identifier for each book entry, automatically generated
    id SERIAL PRIMARY KEY,

    -- title: The name of the book
    title VARCHAR(255) NOT NULL,

    -- author: The person who wrote the book
    author VARCHAR(255) NOT NULL,

    -- isbn: International Standard Book Number, used to fetch book covers from API
    -- This can be ISBN 10 or ISBN 13 format
    isbn VARCHAR(20),

    -- rating: Your personal rating of the book (scale of 1 to 10)
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),

    -- date_read: When you finished reading the book
    date_read DATE,

    -- notes: Your personal notes and thoughts about the book
    -- This can be a long text with multiple paragraphs
    notes TEXT,

    -- created_at: Timestamp when this record was added to the database
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- updated_at: Timestamp when this record was last modified
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the rating column for faster sorting by rating
CREATE INDEX idx_books_rating ON books(rating DESC);

-- Create an index on the date_read column for faster sorting by recency
CREATE INDEX idx_books_date_read ON books(date_read DESC);

-- Create an index on the title column for faster sorting by title
CREATE INDEX idx_books_title ON books(title ASC);

-- Sample data to test the application (optional)
-- You can uncomment these lines to add some example books
-- INSERT INTO books (title, author, isbn, rating, date_read, notes) VALUES
-- ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 8, '2025-01-15', 'A classic American novel about the Jazz Age and the American Dream.'),
-- ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 9, '2025-02-20', 'Powerful story about racial injustice in the American South.'),
-- ('1984', 'George Orwell', '9780451524935', 10, '2025-03-10', 'Dystopian masterpiece about totalitarianism and surveillance.');
