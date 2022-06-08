const express = require('express');
const mongoose = require('mongoose');
const Place = require('./models/place');

const app = express();
const path = require('path');
const res = require('express/lib/response');
const req = require('express/lib/request');

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

app.get('/places', async (req, res) => {
    const places = await Place.find({});
    res.render('places/index', { places });
});

app.get('/places/:id', async ( req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/show', {place});
});

app.listen(3000, ( )=> {
    console.log('Server running on 3000')
});