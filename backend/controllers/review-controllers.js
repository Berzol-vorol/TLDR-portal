const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const User = require('../models/user');
const Summary = require('../models/summary');
const Review = require('../models/review');

const getReviewById = async (req, res, next) => {
    const id = req.params.rid; // {pid: 'p1'}

    let review;
    try {
        review = await Review.findById(id);
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a review.',
            500
        );
        return next(error);
    }
    if(!review){
        const error = new HttpError('Could not find review for the provided id.', 404);
        return next(error);
    }
    res.json({ review: review.toObject({getters: true }) });
}

const getReviewsByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let reviews;
    try{
        reviews = await Review.find( {creator: userId} );
    } catch(err){
        const error = new HttpError('Fetching reviews failed, please try again later', 500);
        return next(error);
    }
    res.json({reviews: reviews.map(review => review.toObject({ getters: true }))});
}

const getReviewsBySummaryId = async (req, res, next) => {
    const summaryId = req.params.pid;
    let reviews;
    try{
        reviews = await Review.find( {summary: summaryId} );
    } catch(err){
        const error = new HttpError('Fetching reviews failed, please try again later', 500);
        return next(error);
    }
    res.json({reviews: reviews.map(review => review.toObject({ getters: true }))});
}

const createReview = async (req, res, next) => {
    const { content, summary, creator } = req.body;
    console.log("creator", req.body)
    const createdReview = new Review({
        content,
        mark : 0,
        publish_date: new Date().toLocaleDateString(),
        summary,
        creator
    })
    let user;
    try {
        user = await User.findById(creator);
    } catch(err){
        const error = new HttpError('Creating review failed, please try again later', 500);
        return next(error);
    }
    if(!user){
        const error = new HttpError('Could not find user for the provided id', 404);
        return next(error);
    }

    let summaryCode;
    try {
        summaryCode = await Summary.findById(summary);
    } catch(err){
        const error = new HttpError('Creating review failed, please try again later', 500);
        return next(error);
    }
    if(!summaryCode){
        const error = new HttpError('Could not find user for the provided id', 404);
        return next(error);
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await createdReview.save({ session: sess });

        user.reviews.push(createdReview);
        await user.save({ session: sess});

        summaryCode.reviews.push(createdReview);
        await summaryCode.save({session: sess});

        await sess.commitTransaction();
    } catch (err){
        const error = new HttpError(
            'Creating review failed, please try again',
            500
        );
        return next(error);
    }
    res.status(201).json({review: createdReview});
}

const updateReview = async (req, res, next) => {
    const id = req.params.rid;
    const { content, mark } = req.body;
    let review
    try{
        review = await Review.findById(id);
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not update the review', 500
        );
        return next(error);
    }

    // if(review.creator.toString() !== req.userData.userId){
    //     const error = new HttpError(
    //         'You are not allowed to edit this review.',
    //         401 
    //     )
    //     return next(error);
    // }

    review.content = content;
    review.mark = mark;

    try{
        await review.save();
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not update the review', 500
        );
        return next(error);
    }
    res.status(200).json({review: review.toObject({ getters: true })});
}

const deleteReview = async (req, res, next) => {
    const id = req.params.rid;

    let review;
    try {
        review = await Review.findById(id);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete review.',
            500
        );
        return next(error);
    }

    if (!review) {
        const error = new HttpError('Could not find review for this id.', 404);
        return next(error);
    }

    // if(review.creator.id !== req.userData.userId){
    //     const error = new HttpError(
    //         'You are not allowed to delete this review.',
    //         401 
    //     )
    //     return next(error);
    // }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await review.remove({ session: sess });

        review.creator.reviews.pull(review);
        await review.creator.save({ session: sess });

        review.summary.reviews.pull(review);
        await review.summary.save({ session: sess });

        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete review.',
            500
        );
        return next(error);
    }
    res.status(200).json({ message: 'Deleted successfully.' });
}

exports.getReviewById = getReviewById;
exports.getReviewsByUserId = getReviewsByUserId;
exports.getReviewsBySummaryId = getReviewsBySummaryId;
exports.createReview = createReview;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;