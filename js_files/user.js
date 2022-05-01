"use strict";

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

exports.login = function(email, password) {
    let result = db.prepare('SELECT id FROM users WHERE email = ? AND password = ?').get(email, password);
    return result === undefined ? 0: result.id;
}

exports.new_user = function(firstName, lastName, email, password) {
    let result = db.prepare('INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)').run(firstName, lastName, email, password);
    return result.lastInsertRowid;
}

exports.update = function(firstName, lastName, email, password) {
    let user = {
        firstName : firstName,
        lastName : lastName,
        email : email,
        password : password
    };
    let result = db.prepare(`UPDATE users SET firstName = @firstName, lastName = @lastName, email = @email, password = @password`).run(user);
    return result.changes === 1;
}

exports.delete = function() {
    if (id in users) {
        db.prepare(`SELECT * FROM users`);
        return true;
    }
    return false;
}