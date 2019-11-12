const Article = require('../models/articleModels');
const catchAsync = require('../utils/catchAsync');
// const AppErrpr = require('../utils/appError');
const multer = require('multer');
// const sharp = require('sharp');



// Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/articles')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    console.log(file)
    req.photoName = `article-${req.user.id}-${Date.now()}.${ext}`
    cb(null, req.photoName)
    //   console.log('req.params.id')
    //   console.log(req.params)
    // cb(null, `article-${Date.now()}.${ext}`)
    // null, file.filename + '-'
  }
});


// const multerFilter = (req, file, cb) => {
//     if(file.mimetype.startsWith('image')){
//       cb(null, true);
//     } else{
//       cb(new AppError('Not an image! Please upload only images.', 400), false);
//     }
// }
  
  
const upload = multer({
    storage: multerStorage,
    // fileFilter: multerFilter
});

exports.uploadArticleImages = upload.single('photo');
// exports.uploadUserPhoto = upload.single('photo');


// ----------------------------------------------


exports.createArticle = catchAsync( async (req, res, next) => {
    // console.log('req.body')
    // console.log('req.file')
    // console.log(req.file)
    // если есть загруженный файл изображкеие
    if(req.file) req.body.photo = req.file.filename;
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
    // res.setHeader('Set-Cookie', 'xxxIn=true')
    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: {
            articles: articles 
        }
    });
});