const db = require("../db");
const {v4: uuidv4} = require("uuid");

// Create user
createUser(email, hashedPassword, role, (err, userId) => {
  if (err) {
    return res.status(500).json({ error: "User already exists or DB error" });
  }
  res.json({ message: "User registered successfully", userId });
});


// Find user by email
const findUserByEmail = (email, callback) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], (err, row) => {
    callback(err, row);
  });
};

module.exports = { createUser, findUserByEmail };
