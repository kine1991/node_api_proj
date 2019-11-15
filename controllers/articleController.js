const Article = require('../models/articleModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multer = require('multer');
const sharp = require('sharp');



// Multer ---------------------------------------
// ----------------------------------------------
// ----------------------------------------------
const multerStorage = multer.memoryStorage();
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/articles');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     req.imageName = `article-${req.user.id}-${Date.now()}.${ext}`
//     cb(null, req.imageName)
//   }
// });

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

exports.uploadArticleImages = upload.array('images', 2); 

exports.resizeArticleImages = catchAsync(async (req, res, next) => {
    if(!req.files.length) return next(); // если нету изображение => next()

    // Images 
    req.body.imagesPath = [];

    await Promise.all(
        req.files.map( async(file, i) => {
            const filename = `article-${req.user.id}-${Date.now()}-${i+1}.jpeg`;
            await sharp(file.buffer)
                .resize(400, 400)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/articles/${filename}`)

            req.body.imagesPath.push(`img/articles/${filename}`);
        })
    );

    next();
});

// exports.uploadArticleImages = upload.single('image'); // одно фото с именем req.body.image
// exports.uploadTourImages = upload.fields([
//     {name: 'imageCover', maxCount: 1},
//     {name: 'images', maxCount: 3},
//   ]);
//   // upload.array('images', 5)
// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------


exports.createArticle = catchAsync( async (req, res, next) => {
    // const url = req.protocol + "://" + req.get("host");
    req.body.creator = req.user.id;
    const newArticle = await Article.create(req.body);
    // const newArticle = await Article.create({
    //     title: req.body.title,
    //     body: req.body.body,
    //     creator: req.user.id,
    //     imagePath: imagePath
    // });

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