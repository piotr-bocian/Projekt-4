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
        minLength: 50,
        required: true
    },
    photo: {
        type: String,
        required: true,
        // URL zdjęcia z zewnętrznego zródła
    }
})

module.exports = mongoose.model('Post', postSchema);