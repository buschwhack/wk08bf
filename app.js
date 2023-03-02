const express = require('express');
const path = require('path');
let app = express();
const mysql = require('mysql');


app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));


const connection = mysql.createConnection({
    host:'localhost',
    user: '',
    password: '',
    database: '7062',
    port: '',
    multipleStatements: true
});

connection.connect((err)=>{
    if(err) return console.log(err.message);
    console.log("connected to local mysql db");
});



app.get('/',  (req, res) => {

    let read = `SELECT id, book_name, release_yr 
                FROM booklibrary`;

    connection.query(read, (err, bookdata)=>{ 
        if(err) throw err;
        res.render('books', {bookdata});
    });

});

app.get('/book', (req, res) => {

    let getid = req.query.bid;

    let getrow = `SELECT booklibrary.book_name, booklibrary.release_yr, booklibrary.author,
                  booklibrary.img_path, bookpublisher.publisher
                  FROM booklibrary INNER JOIN
                  bookpublisher ON
                  booklibrary.publisher = bookpublisher.id
                  WHERE booklibrary.id = ? `;

    connection.query(getrow, [getid], (err, bookrow)=>{ 
        if(err) throw err;
        console.table(bookrow);
       
        res.render('item', {bookrow});
    });

});

app.get('/bookchars', (req, res) => {

    let getid = req.query.bid;

    let getrow = `SELECT * FROM booklibrary WHERE id = ?;
                  SELECT bookcharacters.name FROM book_chars INNER JOIN 
                  bookcharacters ON
                  book_chars.char_id = bookcharacters.id
                  WHERE book_id = ? `;

    connection.query(getrow, [getid, getid], (err, bookrow)=>{ 
        if(err) throw err;
        let bookdeets = bookrow[0];
        let bookchars = bookrow[1];
        res.render('itemchars', {bookdeets, bookchars});
    });

});



app.listen(process.env.PORT || 3000, ()=>{ 
    console.log("server started on: localhost:3000");
});