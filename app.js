const express = require('express');
const mongoose = require('mongoose');
const Place = require('./models/place');

const methodOverride = require('method-override');
const app = express();
const path = require('path');
const res = require('express/lib/response');
const req = require('express/lib/request');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

app.get('/places/new', (req, res) => {
    res.render('places/new');
});

app.post('/places', async (req, res) => {
    const place = new Place(req.body.place);
    await place.save();
   res.redirect(`/places/${place._id}`);
});

app.get('/places/:id', async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/show', {place});
});

app.get('/places/:id/edit', async(req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/edit', {place});
});

app.put('/places/:id', async(req,res) => {
    const {id} = req.params;
    const place = await Place.findOneAndUpdate(id, {...req.body.place});
    res.redirect(`/places/${place._id}`);
});



app.listen(3000, ( )=> {
    console.log('Server running on 3000')
});