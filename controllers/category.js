/** @format */

const Category = require("../models/category");
const slugify = require("slugify");
const multer = require("multer");


function createCategories  (categories , parent = null ) {
  const categoryList = []
  let category;
  if (parent == null) {
    category = categories.filter(cat => cat.parent == undefined)
    
  }else {
    category = categories.filter(cat => cat.parent == parent)
  }

  for(let cate of category){
    categoryList.push({
      _id:cate._id,
      name:cate.name,
      slug:cate.slug,
      icon:cate.icon,
      children: createCategories(categories,cate._id)
    })

  }
  return categoryList;
};

// set storage
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },

  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" || ext !== ".png") {
      return cb(res.status(400).end("only jpg, png are allowed"), false);
    }
    cb(null, true);
  },
});

var uploadImage = multer({ storage: storage }).single("file");

exports.upload = (req, res) => {
  uploadImage(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      image: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
};



exports.create = (req, res) => {
  console.log(req.body.name);

  const categoryObj = {
    name: req.body.name,
    slug:slugify(req.body.name).toLowerCase(),
  }
 
  if (req.body.parent) {
    categoryObj.parent= req.body.parent
    
  }
  if(req.body.icon){
    categoryObj.icon= req.body.icon

  }
  const category = new Category(categoryObj);


  category.save((err,cat) => {
    if (err) return res.status(400).json({  err });
    if (cat) {
      return res.status(200).json({ success: true ,cat});

    }
  });
};

exports.list = (req, res) => {
  Category.find({})
    .exec((err, categories) => {
      if (err) {
        return res.json({
          err
        });
      }
      if (categories) {
        const categoryList = createCategories(categories)
        res.json(categoryList);

      }
    });
};



exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Category.findOneAndRemove({ slug }).exec((err, approvedelete) => {
    if (err || !approvedelete) {
      return res.status(400).json({
        err,
      });
    }
    res.json({
      message: "delete successfully",
    });
  });
};



exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Category.findOne({ slug }).exec((err, updatecat) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    updatecat.name =  req.body.name;
    updatecat.slug =  slugify(req.body.name).toLowerCase()
    updatecat.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }

      res.json(result);
    });
  });
};
