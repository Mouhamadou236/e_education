"use strict";

const Sqlite = require('better-sqlite3');

let db = new Sqlite('db.sqlite');

exports.login = function(email, password) {
    let result = db.prepare('SELECT id FROM user WEHRE email = ? AND password = ?').get(email, password);
    return result === undefined ? 0: result.id;
}

exports.new_user = function(firstName, lastName, email, password) {
    let result = db.prepare('INSERT INTO user (firstName, lastName, email, password) VALUES (?, ?, ?, ?)').run(firstName, lastName, email, password);
    return result.lastInsertRowid;
}