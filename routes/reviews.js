const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Place = require('../models/place');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const { validateReview, isLoggedIn } = require('../middleware');


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash('success', 'Successfully created a new review!')
    res.redirect(`/places/${place._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/places/${id}`);
}));

module.exports = router;