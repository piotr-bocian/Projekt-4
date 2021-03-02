const mongoose = require('mongoose');
const app = require('../../app');
const {Post, ValidatePost} = require('../models/post');

// GETL ALL post forms
  exports.postFormsGetAll = async (req, res, next) => {
    const postForms = await Post.find();
    res.send(postForms);
  }

// GET one post form
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


/// NIE SKONCZONE
/// NIE SKONCZONE
/// NIE SKONCZONE
/// NIE SKONCZONE

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

  /// Z ADOPTION
  /// Z ADOPTION
  /// Z ADOPTION
  /// Z ADOPTION

// POST adoption form
exports.addAdoptionForm = async (req, res, next) => {
  try{
      const {content, userID, animalID} = req.body;
      const value = await validateAdoptionForm.validateAsync({
          content,
          userID,
          animalID,
      });
      let adoptionFormOne = new AdoptionForm({
          _id: mongoose.Types.ObjectId(),
          ...value
      });
      adoptionFormOne = await adoptionFormOne.save();
      res.status(201).send({
          message: 'Formularz zostal zapisany',
          adoptionFormOne,
        });
  }
  catch(error){
      res.status(400).send(error.message);
  }
}

// UPDATE adoption form
exports.editAdoptionForm = async (req, res, next) => {
  const adoptionId = req.params.adoptionId;
  if(!mongoose.Types.ObjectId.isValid(adoptionId))
      return res.status(400).send('Podano bledny numer _adoptionId');
  try{
      const updateOps = {}
      for(const ops of req.body){
          updateOps[ops.propertyName] = ops.newValue;
      }
      // await validateVolunteerFormLight.validateAsync(updateOps);
      const adoptionForm = await AdoptionForm.findOneAndUpdate(
          { _id: id },
          { $set: updateOps},
      );
      res.status(200).send({
          message: `Zaktualizowano nastepujące pola ${JSON.stringify(
              updateOps
            )}`,
            adoptionForm
      });
  }
  catch(error){
      res.status(400).send(error.message);
  }
};

// DELETE adoption form
exports.deleteAdoptionForm = async (req, res, next) => {
  const adoptionId = req.params.adoptionId;
  if(!mongoose.Types.ObjectId.isValid(adoptionId))
      return res.status(400).send('Podano błędny numer _adoptionId');

  const adoptionForm = await AdoptionForm.findByIdAndRemove(adoptionId);

  if(!adoptionForm)
      return res.status(404).send('Taki formularz nie figuruje w naszej bazie danych');

  res.status(202).send({
      message: 'Formularz zostal poprawnie usuniety z bazy danych',
      adoptionForm
  });
}