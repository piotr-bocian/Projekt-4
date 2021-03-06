const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const postSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    postDate: {
        type: Date,
        default: Date.now,
        required: false
    },
    content: {
        type: String,
        minLength: 50,
        require: false
    },
    photo: {
        type: String,
        // URL zdjęcia z zewnętrznego zródła
    }
})
const PostSchema = mongoose.model('Post', postSchema);

    const schema = Joi.object({
      postDate: Joi.date(),
      content: Joi.string().min(50),
      photo: Joi.string()
    });

  exports.ValidatePost = schema;
  exports.Post = PostSchema;