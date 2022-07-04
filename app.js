const express = require('express');
const mongoose = require('mongoose');
const Place = require('./models/place');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas.js');



const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const res = require('express/lib/response');
const req = require('express/lib/request');
const ejsMate = require('ejs-mate');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost:27017/zusammen', {
});

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


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

app.post('/places', catchAsync(async (req, res) => {
    const place = new Place(req.body.place);
    await place.save();
   res.redirect(`/places/${place._id}`);
}));

app.get('/places/:id', catchAsync(async (req, res) => {
    const place = await Place.findById(req.params.id).populate('reviews');
    res.render('places/show', {place});
}));

app.get('/places/:id/edit', catchAsync(async(req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/edit', {place});
}));

app.put('/places/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    const place = await Place.findOneAndUpdate(id, {...req.body.place});
    res.redirect(`/places/${place._id}`);
}));

app.delete('/places/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    await Place.findByIdAndDelete(id);
    res.redirect('/places');
}));

app.post('/places/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);
    console.log(review);
    place.reviews.push(review);
    await review.save();
    await place.save();
    res.redirect(`/places/${place._id}`);
}))

app.delete('/places/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/places/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(3000, ( )=> {
    console.log('Server running on 3000')
});