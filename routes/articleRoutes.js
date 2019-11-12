const express = require('express');


const articleController = require('../controllers/articleController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/')
    .get(articleController.getAllArticles)
    .post(authController.protect, articleController.uploadArticleImages, articleController.createArticle)

module.exports = router;