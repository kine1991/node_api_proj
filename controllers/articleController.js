const Article = require('../models/articleModels');
const catchAsync = require('../utils/catchAsync');
// const AppErrpr = require('../utils/appError');

exports.createArticle = catchAsync( async (req, res, next) => {
    // console.log('req.body')
    // console.log(req.body)

    const newArticle = await Article.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            article: newArticle 
        }
    })
})