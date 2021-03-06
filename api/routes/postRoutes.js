const postController = require('../controllers/postController');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authorization');

router.get('/', postController.postFormsGetAll);
router.get('/:postId', postController.postFormGetOne);
router.post('/', auth.loggedUser, postController.addpostForm);
router.put('/:postId', auth.isAdmin, postController.editpostForm);
router.delete('/:postId', auth.isAdmin, postController.deletepostForm);

module.exports = router;