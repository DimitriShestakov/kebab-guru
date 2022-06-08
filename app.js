const express = require('express');
const mongoose = require('mongoose');

const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb://localhost:27017/zusammen', {
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.get('/', (req, res) => {
   res.render('home');
});

app.listen(3000, ( )=> {
    console.log('Server running on 3000')
});