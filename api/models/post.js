const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

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

const PostSchema = mongoose.model('Post', postSchema);

function ValidatePostSchema(post) {
    const schema = Joi.object({
      postDate: Joi.Date().required(),
      content: Joi.string().min(50).required(),
      photo: Joi.string().required()
    });

    return Joi.validate(post, schema);
  }

  exports.ValidatePost = ValidatePostSchema;
  exports.Post = PostSchema;