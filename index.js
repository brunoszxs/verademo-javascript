const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
    db.run("INSERT INTO users (username, password) VALUES ('admin', 'admin')");
});

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // Vulnerable SQL query
    let sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.get(sql, [], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (row) {
            res.send("Login success!");
        } else {
            res.send("Login failed!");
        }
    });
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

let password = "DBqwertyuiop"