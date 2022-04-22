"use strict";

const fs = require('fs');


const Sqlite = require('better-sqlite3');
let db = new Sqlite('db.sqlite');

db.prepare('DROP TABLE IF EXISTS users').run();
db.prepare('DROP TABLE IF EXISTS first_year').run();
db.prepare('DROP TABLE IF EXISTS second_year').run();
db.prepare('DROP TABLE IF EXISTS course').run();

db.prepare('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, email TEXT, password TEXT)').run();
db.prepare('CREATE TABLE first_year (subject TEXT)').run();
db.prepare('CREATE TABLE second_year (subject TEXT)').run();
db.prepare('CREATE TABLE course (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, file TEXT, movie TEXT, date TEXT)').run();


exports.load = function(fileName) {
    const course = JSON.parse(fs.readFileSync(fileName));
    let insert  = db.prepare('INSERT INTO course VALUES (@id, @title, @file, @movie, @image, @date');
    let clear_and_insert_many = db.transaction((course) => {
        db.prepare('DELETE FROM course');
        for (let id of Object.keys(course)) {
            insert.run(course[id]);
        }
    });
    clear_and_insert_many(course);
    return true;
}

exports.read = function(id) {
    let result = db.prepare('SELECT * FROM course WHERE id = ' + id);
    return result === undefined ? null : result;
}

exports.create = function(title, file, movie, image, date) {
    let course = {
        title : title,
        file : file,
        movie : movie,
        image : image,
        date : date,
    }; 
    let result = db.prepare('INSERT INTO course (title, file, movie, image, date) VALUES (@title, @file, @movie, @image, @date)').run(course);
    return result.lastInsertRowid;
}

exports.save = function(fileName) {
    let course_list = db.prepare('SELECT FROM course ORDER BY id').all();
    let courses = {};
    for (let course of course_list) {
        courses[course.id] = course;
    }
    fs.writeFileSync(fileName, JSON.stringify(courses));
}

exports.update = function(id, title, file, movie, image, date) {
    let course = {
        id : id,
        title : title,
        file : file,
        movie : movie,
        image : image,
        date : date,
    };
    let result = db.prepare('UPDATE course SET tilte = @title, file = @file, movie = @movie, image = @image, date = @date').run(course);
    return result.changes === 1;
}

exports.delete = function(id) {
    if (id in course) {
        db.prepare('SELECT * FROM course WHERE id = ' + id);
        return true;
    }
    return false;
}

