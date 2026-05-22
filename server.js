const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ===== DATABASE CONNECTION =====
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smartservice"
});


// ===== CONNECT DATABASE =====
db.connect((err) => {

  if (err) {
    console.log("Database connection failed");
    console.log(err);

  } else {

    console.log("MySQL Connected Successfully");

    // USERS TABLE
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `;

    // BOOKINGS TABLE
    const createBookingsTable = `
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        service VARCHAR(255) NOT NULL,
        booking_date DATE NOT NULL,
        booking_time VARCHAR(50) NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.query(createUsersTable, (err) => {
      if (err) {
        console.log("Users table error", err);
      }
    });

    db.query(createBookingsTable, (err) => {
      if (err) {
        console.log("Bookings table error", err);
      }
    });

  }

});


// ===== EMAIL SETUP =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "eshamaryam1076@gmail.com",
    pass: "upkq gwkr cqih pgtr"
  }
});


// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("Server is running successfully");
});


// ===== REGISTER API =====
app.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  try {

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {

      if (err) {

        console.log(err);

        if (err.code === "ER_DUP_ENTRY") {
          res.status(400).send("Email already exists");
        } else {
          res.status(500).send("Registration failed");
        }

      } else {

        res.send("Registration successful!");

      }

    });

  } catch (error) {

    console.log(error);
    res.status(500).send("Server error");

  }

});


// ===== LOGIN API =====
app.post("/login", (req, res) => {

  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {

    if (err) {

      console.log(err);
      res.status(500).send("Database error");

    } else if (result.length > 0) {

      // CHECK PASSWORD
      const validPassword = await bcrypt.compare(
        password,
        result[0].password
      );

      if (validPassword) {

        res.json({
          success: true,
          user: {
            id: result[0].id,
            name: result[0].name,
            email: result[0].email
          }
        });

      } else {

        res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });

      }

    } else {

      res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });

    }

  });

});


// ===== BOOKING API =====
app.post("/booking", (req, res) => {

  const {
    user_email,
    service,
    booking_date,
    booking_time,
    message
  } = req.body;

  const sql = `
    INSERT INTO bookings
    (user_email, service, booking_date, booking_time, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_email, service, booking_date, booking_time, message],
    (err, result) => {

      if (err) {

        console.log(err);
        res.status(500).send("Booking failed");

      } else {

        res.send("Booking successful!");

      }

    }
  );

});


// ===== GET MY BOOKINGS =====
app.get("/my-bookings", (req, res) => {

  const { email } = req.query;

  const sql = `
    SELECT *
    FROM bookings
    WHERE user_email = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [email], (err, result) => {

    if (err) {

      console.log(err);
      res.status(500).send("Error fetching bookings");

    } else {

      res.json(result);

    }

  });

});


// ===== CONTACT EMAIL API =====
app.post("/contact", (req, res) => {

  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: "eshamaryam1076@gmail.com",
    subject: `New Contact Message from ${name}`,
    text: `
Name: ${name}
Email: ${email}

Message:
${message}
`
  };

  transporter.sendMail(mailOptions, (err, info) => {

    if (err) {

      console.log(err);
      res.status(500).send("Email sending failed");

    } else {

      res.send("Message sent successfully!");

    }

  });

});
// ===== UPDATE BOOKING STATUS =====

app.put("/update-booking-status/:id", (req, res) => {

  const bookingId = req.params.id;
  const { status } = req.body;

  const sql = "UPDATE bookings SET status = ? WHERE id = ?";

  db.query(sql, [status, bookingId], (err, result) => {

    if (err) {
      console.log(err);
      res.status(500).send("Failed to update booking");
    } else {
      res.send("Booking status updated!");
    }

  });

});


// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});