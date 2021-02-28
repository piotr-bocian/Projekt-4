const mongoose = require('mongoose');
const app = require('../../app');
const {Post, validatePost} = require('../models/post');

// FIND POST
app.use('/:postID', (req, res, next) => {
    const postId = Number(req.params.postId);
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
      return res.status(404).send('Post not found');
    }
    req.postIndex = postIndex;
    next();
  });

// GETL ALL post forms
// exports.postForms = async (req, res, next) => {
//     console.log('All post forms')
//     const Posts = await Post.find();
//     res.send(Posts);
// }


// GETL ALL post forms
exports.postForms = async(req, res, next) => {
    const Posts = await Post.find();
    res.send(Posts);
  };

// GET one post form
// exports.postFormGetOne = async (req, res, next) => {
//     const postFormsOne = await Post.findById(req.params.postId);
//     if(!postFormsOne) return res.status(404).send('Formularz wolontariusza o podanym ID nie istnieje.');

//     res.send(postFormsOne);
// }

// GET one post form
app.get('/:postId', (req, res, next) => {
    res.send(posts[req.postIndex]);
  });

  // Update post
exports.editpostForm = async (req, res, next) => {
     const newPost = await req.body;
    const postId = Number(req.params.postId);
    if (!newPost.id || newPost.id !== postId) {
        newPost.id = postId;
    }
    cards[req.cardIndex] = newPost;
    res.send(newPost);
  };


  // Delete post
exports.deletepostForm = async (req, res, next) => {
    await posts.splice(req.postIndex, 1);
    res.status(204).send();
  };