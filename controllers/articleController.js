const Article = require('../models/articleModels');
const catchAsync = require('../utils/catchAsync');
// const AppErrpr = require('../utils/appError');

const multer = require('multer');
// const sharp = require('sharp');



// Multer ---------------------------------------
// ----------------------------------------------
// ----------------------------------------------
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const MIME_TYPE_MAP = {
//         'image/png': 'png',
//         'image/jpeg': 'jpg',
//         'image/jpg': 'jpg',
//     }
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error('Invalid mime type');
//     if(isValid){
//         error = null
//     }
//     cb(error, 'public/img/articles');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     req.imageName = `article-${req.user.id}-${Date.now()}.${ext}`
//     cb(null, req.imageName)
//   }
// });
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/articles');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    req.imageName = `article-${req.user.id}-${Date.now()}.${ext}`
    cb(null, req.imageName)
  }
});


const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
      cb(null, true);
    } else{
      cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
}
  
  
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadArticleImages = upload.single('image'); // одно фото с именем req.body.image

// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------


exports.createArticle = catchAsync( async (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    let imagePath;
    // если есть загруженный файл изображкеие
    if(req.file){
        imagePath = `${url}/img/articles/${req.file.filename}`; // http://localhost:3000/img/articles/article-5c8a1d5b0190b214360dc057-1573646948376.png
    } else{
        imagePath = undefined;
    }
    
    const newArticle = await Article.create({
        title: req.body.title,
        body: req.body.body,
        creator: req.user.id,
        imagePath: imagePath
    });

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
    // .select(fields)
    // res.setHeader('Set-Cookie', 'xxxIn=true')
    const articles = await Article.find({})
    .populate('creator')
    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: {
            articles: articles 
        }
    });
});