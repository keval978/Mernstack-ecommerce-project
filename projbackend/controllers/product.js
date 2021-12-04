const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { parseInt, sortBy, update } = require("lodash");


exports.getProductById = (req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({
                error:"product not found"
            })
        }
        res.product = product;
        next();
    })

}

exports.createProduct = (req,res)=>{
  let form = new formidable.IncomingForm();
  
  form.keepExtensions = true;  //this method allow to any file png and gpg formate 
  form.parse(req,(err,fields,file)=>{
      if(err){
          return res.status(400).json({
              error:"problem with image"
          })
      }
      //destructuring fiels
      
       const {name,description,price,category,stoke} = fields

    //   if(!name || !description ||!price ||!category ||!stoke){
    //     return res.status(400).json({
    //         error:"Please inculde the fiels"
    //     })
    //   }


      
      let product = new Product(fields)

      //hanle file here
      if(file.photo){
          if(file.photo.size > 3000000){
              return res.status(400).json({
                  error:"file size  too big"
              })
          }
          product.photo.data = fs.readFileSync(file.photo.path);
          product.photo.contentType = file.photo.type

      }
      console.log(product);
      //save to db
      product.save((err,product)=>{
          if(err){
              return res.status(400).json({
                  error:"saving t shirt saving failed"
              })  
          }
          res.json(product)
      })
  })
};



exports.getProduct = (req,res)=>{
    req.product.photo = undefined
    return res.json(req.product)
}



//middleware 
exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
};


//delete  controller
exports.deleteProduct = (req,res)=>{
  let product = req.product;
  product.remove((err,deleteProduct)=>{
      if(err){
          return res.status(400).json({
              error:"Failed tod delete the product"
          })
      }
      res.json({
          message:"Deletiom was a seccuess",
          deleteProduct
      })
  })  
};


exports.updateProduct = (req,res)=>{
    let form = new formidable.IncomingForm();
  
  form.keepExtensions = true;  //this method allow to any file png and gpg formate 
  form.parse(req,(err,fields,file)=>{
      if(err){
          return res.status(400).json({
              error:"problem with image"
          })
      }
      


      //update code
      let product = req.product
      product = _.extend(product,fields)

      //hanle file here
      if(file.photo){
          if(file.photo.size > 3000000){
              return res.status(400).json({
                  error:"file size  too big"
              })
          }
          product.photo.data = fs.readFileSync(file.photo.path);
          product.photo.contentType = file.photo.type

      }
      //console.log(product);
      //save to db
      product.save((err,product)=>{
          if(err){
              return res.status(400).json({
                  error:"saving t shirt updation  failed"
              })  
          }
          res.json(product)
      })
  })    
};


// product listing

exports.getAllProduct = (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ?  req.query.sortBy : "_id";

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                error:"No product found"
            })
        }
        res.json(products)
    })  
}


exports.getAllUniqueCategories = (req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({
                error:"No category found"
            })
        }
        res.json(category)
    })
}


exports.updateStock = (req,res,next)=>{

    let myOparations = req.body.order.products.map(prod=>{
        return {
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc:{stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOparations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                error:"Bulk opration is failed"
            })
        } 
        next();
    })
}















