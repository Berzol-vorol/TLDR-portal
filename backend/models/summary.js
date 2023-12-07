const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const summarySchema = new Schema({
    title: { type: String, required: true },
    resource_url: { type: String, required: true},
    text: { type: String, required: true },
    tags: [{ type: String, required: false }],
    rating: { type: Number, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    reviews: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review'}],
    marksNumber: { type: Number, reqired: false}
})

module.exports = mongoose.model('Summary', summarySchema);