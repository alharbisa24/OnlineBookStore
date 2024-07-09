const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();


const getAllBooks = () => {
  return books;
};
const findUser = (username) => {
  return users.some((user) => user.username === username);
};


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Missing username or password" });
  } else if (findUser(username)) {
    return res.status(404).json({ message: "user already exists." });
  } else {
    users.push({ username: username, password: password });
    return res
      .status(200)
      .json({ message: "User successfully registered.  Please login." });
  }
});

public_users.get("/", async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const targetISBN = parseInt(req.params.isbn);
  const targetBook = await books[targetISBN];
  if (!targetBook) {
    return res.status(404).json({ message: "ISBN not found." });
  } else {
    return res.status(200).json(targetBook);
  }
});

public_users.get("/author/:author", async (req, res) => {
  const matchingBooks = Object.values(await books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase());
  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books by provided author." });  
  }
});

public_users.get("/title/:title", async (req, res) => {
  const matchingTitle = Object.values(await books).filter(
    (book) => book.title.toLowerCase() === req.params.title.toLowerCase());
  if (matchingTitle) {
    return res.status(200).json(matchingTitle);
  } else {
    return res.status(404).json({ message: "Title not found." });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const targetISBN = req.params.isbn;
  const targetBook = books[targetISBN];
  if (targetBook) {
    return res.status(200).send(JSON.stringify(targetBook.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "ISBN not found." });
  }
});

module.exports.general = public_users;



// Function to search for a book by its ISBN using Promises
