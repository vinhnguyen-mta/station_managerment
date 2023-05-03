const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 5000;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  port: 3307,
  user: "root",
  password: "",
  database: "station_managerment",
});

app.use(express.urlencoded({ extended: true })); // New
app.use(express.json()); // New

// Get all user
app.get("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query("SELECT * from user", (err, rows) => {
      connection.release(); // return the connection to pool

      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }

      // if(err) throw err
      console.log("The data from user table are: \n", rows);
    });
  });
});

// Get an user
app.get("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
        }

        console.log("The data from user table are: \n", rows);
      }
    );
  });
});

// Delete a user
app.delete("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "DELETE FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send(
            `User with the record ID ${[req.params.id]} has been removed.`
          );
        } else {
          console.log(err);
        }

        console.log("The data from user table are: \n", rows);
      }
    );
  });
});

// Add user
app.post("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const params = req.body;
    connection.query("INSERT INTO user SET ?", params, (err, rows) => {
      connection.release();

      if (!err) {
        res.send(`user with the record ID  has been added.`);
      } else {
        console.log(err);
      }
      console.log("The data from user table are:11 \n", rows);
    });
  });
});

// Update a record / user
app.put("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    const { id, name, tagline, description, image } = req.body;

    connection.query(
      "UPDATE user SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?",
      [name, tagline, description, image, id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(`User with the name: ${name} has been added.`);
        } else {
          console.log(err);
        }
      }
    );

    console.log(req.body);
  });
});

// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port localhost:${port}`));
