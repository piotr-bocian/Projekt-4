const mongoose = require('mongoose');
const { Post, ValidatePost } = require('../models/post');

// GETL ALL post forms
  exports.postFormsGetAll = async (req, res, next) => {
    const postForms = await Post.find();
    res.send(postForms);
  }

// GET One post form
exports.postFormGetOne = async (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.postId))
      return res.status(400).send('Podano błędny numer _postId');
  const postForm = await Post.findById(req.params.postId);
  if(!postForm) return res.status(404).send('Post o podanym ID nie istnieje.');

  res.send({
      postForm: postForm,
      request: {
          type: 'GET',
          description: 'Get all post forms',
          url: 'localhost:3000/api/posts/',
      }
  });
}

// POST adoption form
exports.addpostForm = async (req, res, next) => {
  try{
      const {postDate, content, photo} = req.body;
      const value = await ValidatePost.validateAsync({
          postDate,
          content,
          photo,
      });
      let postForm = new Post({
        _id: mongoose.Types.ObjectId(),
          ...value
      });
      postForm = await postForm.save();
      res.status(201).send({
          message: 'Formularz zostal zapisany',
          postForm,
        });
  }
  catch(error){
      res.status(400).send(error.message);
  }
}

// UPDATE post form
//
exports.editpostForm = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.postId);
  if (!isIdValid) {
    res.status(400).send('Podano błędny numer _id');
    return;
  }
  try {
    const { postDate, content, photo } = req.body;
    console.log(req.body)
    await ValidatePost.validateAsync({
      postDate,
      content,
      photo,
    });

    let post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        postDate,
        content,
        photo,
      },
      { new: true }
    );
    res.status(200).send({
      message: 'Zaktualizowano post',
      post,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// DELETE post form
exports.deletepostForm = async (req, res, next) => {
  const postId = req.params.postId;
  if(!mongoose.Types.ObjectId.isValid(postId))
      return res.status(400).send('Podano błędny numer _postId');

  const postForm = await Post.findByIdAndRemove(postId);

  if(!postForm)
      return res.status(404).send('Taki formularz nie figuruje w naszej bazie danych');

  res.status(202).send({
      message: 'Formularz zostal poprawnie usuniety z bazy danych',
      postForm
  });
}