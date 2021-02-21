const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    postDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true,
    }
})

module.exports = new mongoose.model('Post', postSchema);