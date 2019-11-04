const Article = require('../models/articleModels');
const catchAsync = require('../utils/catchAsync');
// const AppErrpr = require('../utils/appError');

exports.createArticle = catchAsync( async (req, res, next) => {
    // console.log('req.body')
    // console.log(req.body)
    // console.log('***req.user***')
    // console.log(req.user)
    req.body.creator = req.user.id
    const newArticle = await Article.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            article: newArticle 
        }
    });
});

exports.getAllArticles = catchAsync( async (req, res, next) => {
    // let fields = { title: 1, body: 1, 'creator.role': 1};
    // User.populate(user, { path: 'shortList.flat.project', model: 'Project', select: 'name' })
    // populate({ path: 'fans', select: 'name' }).
    const articles = await Article.find({})
    .populate('creator')
    // .select(fields)
    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: {
            articles: articles 
        }
    });
});