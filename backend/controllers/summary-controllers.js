const mongoose = require('mongoose');
const axios = require('axios');

const HttpError = require('../models/http-error');
const Summary = require('../models/summary');
const User = require('../models/user');

const getSummaryById = async (req, res, next) => {
    const id = req.params.pid; // {pid: 'p1'}

    let summary;
    try {
        summary = await Summary.findById(id);
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a summary.', 
            500
        );
        return next(error);
    }
    if(!summary){
        const error = new HttpError('Could not find summary for the provided id.', 404);
        return next(error);
    }
    res.json({ summary: summary.toObject({getters: true }) });
}

const getAllSummaries = async (req, res, next) => {
    let summaries;
    try{
        summaries = await Summary.find({}); // exclude password
    } catch(err){
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({summaries: summaries.map(user => user.toObject({ getters: true }))});
}

const getSummariesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let summaries;
    try{
        summaries = await Summary.find( {creator: userId} );
    } catch(err){
        const error = new HttpError('Fetching summaries failed, please try again later', 500);
        return next(error);
    }
    res.json({summaries: summaries.map(summary => summary.toObject({ getters: true }))});
}

const createSummary = async (req, res, next) => {
    const { title, resource_url, text, tags, creator } = req.body;
    const createdSummary = new Summary({
        title, 
        resource_url,
        text, 
        tags, 
        rating: 0,
        reviews: [],
        marksNumber: 0,
        creator,
    })
    let user;
    try {
        user = await User.findById(creator);
    } catch(err){
        const error = new HttpError('Creating summary failed, please try again later', 500);
        return next(error);
    }
    if(!user){
        const error = new HttpError('Could not find user for the provided id', 404);
        return next(error);
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdSummary.save({ session: sess });
        user.summaries.push(createdSummary);
        await user.save({ session: sess});
        await sess.commitTransaction();
    } catch (err){
        const error = new HttpError(
            'Creating summary failed, please try again',
            500
        );
        return next(error);
    }
    res.status(201).json({summary: createdSummary});
}

const updateSummary = async (req, res, next) => {
    const id = req.params.pid;
    const { title, resource_url, text, tags } = req.body;
    let summary
    try{
        summary = await Summary.findById(id);
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not update the summary', 500
        );
        return next(error);
    }

    // if(summary.creator.toString() !== req.userData.userId){
    //     const error = new HttpError(
    //         'You are not allowed to edit this summary.',
    //         401 
    //     )
    //     return next(error);
    // }
    summary.resource_url = resource_url;
    summary.title = title;
    summary.text = text;
    summary.tags = tags;

    try{
        await summary.save();
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not update the summary', 500
        );
        return next(error);
    }
    res.status(200).json({summary: summary.toObject({ getters: true })});
}

const addMark = async (req, res, next) => {
    const id = req.params.pid;
    const { mark } = req.body;
    let summary
    try{
        summary = await Summary.findById(id);
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not update mark', 500
        );
        return next(error);
    }
    summary.marksNumber = summary.marksNumber + 1
    let newRating = (summary.rating * (summary.marksNumber - 1) + parseInt(mark))/ summary.marksNumber
    summary.rating = newRating;

    try{
        await summary.save();
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not update the summary', 500
        );
        return next(error);
    }

    let creator
    try{
        creator = await User.findById(summary.creator);
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not update mark', 500
        );
        return next(error);
    }

    let summaries;
    try{
        summaries = await Summary.find( {creator: creator.id} );
    } catch(err){
        const error = new HttpError('Fetching summaries failed, please try again later', 500);
        return next(error);
    }

    let newUserRating = 0;
    let actualSummariesSize = 0
    summaries.forEach(p => {
        newUserRating += p.rating;
        if(p.rating > 0){
            actualSummariesSize++;
        }
    });
    newUserRating /= actualSummariesSize;
    console.log("rating: ", newUserRating);
    creator.rating = newUserRating;

    try{
        await creator.save();
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not update the summary', 500
        );
        return next(error);
    }
    res.status(200).json({summary: summary.toObject({ getters: true })});
}

const deleteSummary = async (req, res, next) => {
    const id = req.params.pid;

    let summary;
    try {
      summary = await Summary.findById(id);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete summary.',
        500
      );
      return next(error);
    }
  
    if (!summary) {
      const error = new HttpError('Could not find summary for this id.', 404);
      return next(error);
    }

    // if(summary.creator.id !== req.userData.userId){
    //     const error = new HttpError(
    //         'You are not allowed to delete this summary.',
    //         401 
    //     )
    //     return next(error);
    // }
  
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();

      await summary.remove({ session: sess });
      summary.creator.summaries.pull(summary);
      await summary.creator.save({ session: sess });

      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete summary.',
        500
      );
    return next(error);
    }
    res.status(200).json({ message: 'Deleted successfully.' });    
}

const generateTLDR = async (req, res, next) => {
    const { resource_url } = req.body

    const options = {
      method: 'POST',
      url: 'https://tldrthis.p.rapidapi.com/v1/model/abstractive/summarize-url/',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'ffed3221bbmshd854c1a4e93fbccp1d23b6jsn128935f7843f',
        'X-RapidAPI-Host': 'tldrthis.p.rapidapi.com'
      },
      data: {
        url: resource_url,
        // url: 'https://techcrunch.com/2019/08/12/verizon-is-selling-tumblr-to-wordpress-parent-automattic/',
        min_length: 100,
        max_length: 300,
        is_detailed: false
      }
    };

    let response;
    try {
        response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
    res.json({summary: response.data.summary[0]})
}

exports.getSummaryById = getSummaryById;
exports.getAllSummaries = getAllSummaries;
exports.getSummariesByUserId = getSummariesByUserId;
exports.createSummary = createSummary;
exports.updateSummary = updateSummary;
exports.deleteSummary = deleteSummary;
exports.addMark = addMark;
exports.generateTLDR = generateTLDR;