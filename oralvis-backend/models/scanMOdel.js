const db = require("../db");
const { v4: uuidv4 } = require("uuid");

function createScan({ patientName, patientId, scanType, region, imageUrl }) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const uploadDate = new Date().toISOString();

    db.run(
      `INSERT INTO scans (id, patientName, patientId, scanType, region, imageUrl, uploadDate) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, patientName, patientId, scanType, region, imageUrl, uploadDate],
      function (err) {
        if (err) reject(err);
        else resolve({ id, patientName, patientId, scanType, region, imageUrl, uploadDate });
      }
    );
  });
}


function getAllScans() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM scans`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = { createScan, getAllScans };
