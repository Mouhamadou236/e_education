"use strict";

const fs = require('fs');


const Sqlite = require('better-sqlite3');
let db = new Sqlite('db.sqlite');

db.prepare('DROP TABLE IF EXISTS users').run();
db.prepare('DROP TABLE IF EXISTS course').run();

db.prepare('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, email TEXT, password TEXT)').run();
db.prepare('CREATE TABLE course (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, file TEXT, movie TEXT, date TEXT, level TEXT, subject TEXT)').run();


exports.load = function(fileName) {
    const course = JSON.parse(fs.readFileSync(fileName));
    let insert  = db.prepare('INSERT INTO course VALUES (@id, @title, @file, @movie, @date, @level, @subject)');
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

exports.list = function () {
    let list = db.prepare('SELECT * FROM course ORDER BY id').all();
    return list;
}

exports.listProg2 = function() {
    let prog2_list = db.prepare(`SELECT * FROM course WHERE subject = 'Programmation 2'`).all();
    return prog2_list;
}

exports.listStructureDiscrètes = function() {
    let structure_list = db.prepare(`SELECT * FROM course WHERE subject = 'Structures discrètes'`).all();
    return structure_list;
}

exports.listProbabilité = function() {
    let proba_list = db.prepare(`SELECT * FROM course WHERE subject = 'Probabilité'`).all();
    return proba_list;
}

exports.listProgC = function() {
    let progC_list = db.prepare(`SELECT * FROM course WHERE subject = 'Programmation C et Systèmes'`).all();
    return progC_list;
}

exports.listProg1 = function() {
    let prog1_list = db.prepare(`SELECT * FROM course WHERE subject = 'Programmation 1'`).all();
    return prog1_list;
}

exports.listAlgèbre1 = function() {
    let algèbre1_list = db.prepare(`SELECT * FROM course WHERE subject = 'Algèbre 1'`).all();
    return algèbre1_list;
}

exports.listFonct = function() {
    let fonct_list = db.prepare(`SELECT * FROM course WHERE subject = 'Fonctionnements des ordinateurs'`).all();
    return fonct_list;
}

exports.listIntro = function() {
    let intro_list = db.prepare(`SELECT * FROM course WHERE subject = 'Introduction informatique'`).all();
    return intro_list;
}

exports.listL1 = function() {
    let l1_list = db.prepare(`SELECT subject FROM course WHERE level = 'Licence 1' GROUP BY subject`).all();
    return l1_list;
}

exports.listL2 = function() {
    let l2_list = db.prepare(`SELECT subject FROM course WHERE level = 'Licence 2' GROUP BY subject`).all();
    return l2_list;
}



