const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Place = require('../models/place');
const { campgroundSchema, reviewSchema } = require('../schemas.js');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', async (req, res) => {
    const places = await Place.find({});
    res.render('places/index', { places });
});

router.get('/new', (req, res) => {
    res.render('places/new');
});

router.post('/', catchAsync(async (req, res) => {
    const place = new Place(req.body.place);
    await place.save();
    req.flash('success', 'Successfully added a new place!')
   res.redirect(`/places/${place._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const place = await Place.findById(req.params.id).populate('reviews');
    if(!place) {
        req.flash('error', 'Can not find that place!');
        return res.redirect('/places');
    }
    res.render('places/show', {place});
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
    const place = await Place.findById(req.params.id);
    if(!place) {
        req.flash('error', 'Can not find that place!');
        return res.redirect('/places');
    }
    res.render('places/edit', {place});
}));

router.put('/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    const place = await Place.findOneAndUpdate(id, {...req.body.place});
    req.flash('success', 'Successfully updated a place!')
    res.redirect(`/places/${place._id}`);
}));

router.delete('/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    await Place.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a place!')
    res.redirect('/places');
}));

module.exports = router;