// seed.js
const bcrypt = require("bcrypt");
const db = require("./db");
const { v4: uuidv4 } = require("uuid");

async function seed() {
  // 1. Create Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  // 2. Create Scans Table
  db.run(`
    CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      patientName TEXT,
      patientId TEXT,
      scanType TEXT,
      region TEXT,
      imageUrl TEXT,
      uploadDate TEXT
    )
  `);

  // 3. Insert Default Users
  const hashedTech = await bcrypt.hash("123", 10);
  const hashedDent = await bcrypt.hash("123", 10);

  db.run(
    `INSERT OR IGNORE INTO users (id, email, password, role) VALUES (?, ?, ?, ?)`,
    ["tech-uuid", "tech@exm.com", hashedTech, "Technician"]
  );

  db.run(
    `INSERT OR IGNORE INTO users (id, email, password, role) VALUES (?, ?, ?, ?)`,
    ["dent-uuid", "dentist@exm.com", hashedDent, "Dentist"]
  );

  // 4. Insert Demo Scans (only if table empty)
  db.get(`SELECT COUNT(*) as count FROM scans`, (err, row) => {
    if (row.count === 0) {
      const scans = [
        {
          id: uuidv4(),
          patientName: "John Doe",
          patientId: "P001",
          scanType: "CBCT",
          region: "Upper Jaw",
          imageUrl: "https://res.cloudinary.com/dulgbxqkm/image/upload/v1756731777/oralvis_scans/aozapgl2iflxqyxtjpnb.jpg",
          uploadDate: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          patientName: "Jane Smith",
          patientId: "P002",
          scanType: "Panoramic",
          region: "Full Mouth",
          imageUrl: "https://res.cloudinary.com/dulgbxqkm/image/upload/v1756792225/OIP_rrbl2j.jpg",
          uploadDate: new Date().toISOString(),
        },
      ];

      scans.forEach((scan) => {
        db.run(
          `INSERT INTO scans (id, patientName, patientId, scanType, region, imageUrl, uploadDate) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            scan.id,
            scan.patientName,
            scan.patientId,
            scan.scanType,
            scan.region,
            scan.imageUrl,
            scan.uploadDate,
          ]
        );
      });

      console.log("Demo scans inserted");
    }
  });
}

module.exports = seed;
