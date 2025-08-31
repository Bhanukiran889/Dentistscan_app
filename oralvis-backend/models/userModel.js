const db = require("../db");
const { v4: uuidv4 } = require("uuid");

// Create user with UUID
const createUser = (email, password, role, callback) => {
  const id = uuidv4();
  const query = `INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)`;
  db.run(query, [id, email, password, role], function (err) {
    callback(err, id);
  });
};

// Find user by email
const findUserByEmail = (email, callback) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], (err, row) => {
    callback(err, row);
  });
};

module.exports = { createUser, findUserByEmail };
