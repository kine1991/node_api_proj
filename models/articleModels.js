const mongoose = require('mongoose');


const articleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'title is require']
    },
    body: {
        type: String,
        required: [true, 'body is require'],
        minlength: [2, 'body should be equal 2 or more symbors'],
        maxlength: [200, 'body should be equal 50 or less symbors'],
    },
    photo: {
        type: String
    },
    slug: {
        type: String
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;