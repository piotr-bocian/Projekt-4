const postController = require('../controllers/postController');
const express = require('express');
const router = express.Router();

router.get('/', postController.postFormsGetAll);
router.get('/:postId', postController.postFormGetOne);
// router.post('/', postController.addpostForm);
router.put('/:postId', postController.editpostForm);
router.delete('/:postId', postController.deletepostForm);

module.exports = router;