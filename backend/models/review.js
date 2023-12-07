const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    content: { type: String, required: true },
    mark: { type: Number, required: true },
    summary: { type: mongoose.Types.ObjectId, required: true, ref: 'Summary' },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
})

module.exports = mongoose.model('Review', reviewSchema);