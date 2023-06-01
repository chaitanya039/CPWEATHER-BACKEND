const formidable = require("formidable");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const path = require("path");
const Post = require("../Models/postSchema");
const { body, validationResult } = require("express-validator");
const { htmlToText } = require("html-to-text");
const Comment = require("../Models/CommentSchema");

module.exports.createPost = (req, res) =>
{
    const form = formidable({ multiples : true });
    form.parse(req, async (error, fields, files) => {
         const { title, description, body, slug, id } = fields;
         const errors = []; 
         
         if(title === "")
         {
            errors.push({ msg : "Title is required !" });
         }
         if(description === "")
         {
            errors.push({ msg : "Description is required !" });
         }
         if(body === "")
         {
            errors.push({ msg : "Body is required !" });
         }
         if(slug === "")
         {
            errors.push({ msg : "Slug is required !" });
         }
         if(Object.keys(files).length === 0)
         {
            errors.push({ msg : "Image is required" });
         }
         else
         {
            const type = files.image.mimetype;
            const split = type.split("/");
            const extension = split[1];
            if(extension !== "jpg" && extension !== "jpeg" && extension !== "png")
            {
                errors.push({ msg : `.${extension} is not a valid extension !` });
            }
            else
            {
               // We have image with proper extension
               // If name of the image is duplicate then there will be problem use uuid to generate random number
               files.image.newFilename = uuidv4() + "." + extension;
            }
         }
         
         const checkSlug = await Post.findOne({ slug  });
         if(checkSlug)
         {
            errors.push({ msg : "Please check unique slug/URL" });
         }
         // Now Check Errors
         if(errors.length !== 0)
         {
            res.status(400).json({ errors });
         }
         // If no errors
         else
         {
            const newPath = path.join(__dirname , `../../../client/src/uploads/${files.image.newFilename}`);
            
            fs.copyFile(files.image.filepath, newPath, async (error) => {
                if(!error)
                {
                  try
                  {
                     const response = await Post.create({
                        title,
                        description,
                        body,
                        image : files.image.newFilename,
                        slug,
                        user : id
                     });
                     
                     return res.status(201).json({ msg : "Your post has been created successfully !", response });
                  }
                  catch(error)
                  {
                     return res.status(500).json({ errors : error, msg : error.message })
                  }
                }
            });
         }
    });
}

module.exports.fetchPosts = async (req, res) =>
{
   const id = req.params.id;
   const page = req.params.page;
   const perPage = 3;
   const skip = (page - 1) * perPage;
   
   try
   {
      const count = await Post.find({ user : id }).countDocuments();
      // Retrieving response of particular user based on userId of the user.
      const response = await Post.find({ user : id }).skip(skip).limit(perPage).sort({ updatedAt : -1 });
      return res.status(200).json({response, count, perPage});
      
   }
   catch(error)
   {
      return res.status(400).json({ errors : [ { msg : error.message } ] });
   }
}

module.exports.fetchPost = async (req, res) => {
   const id = req.params.id;
   
   try
   {
      const post = await Post.findOne({ _id : id });
      return res.status(200).json({ post });
   }
   catch(error)
   {
      return res.status(400).json({ errors : [ { msg : error.message } ] });
   }
}

module.exports.updatePostValidations = [
   body('title').notEmpty().trim().withMessage("Title is required !"),
   body('body').notEmpty().trim().custom((value) => {
      let bodyValue = value.replace(/\n/g, " ");
      if(htmlToText(bodyValue).trim().length === 0)
      {
         return false;
      }
      else
      {
         return true;
      }
   } ).withMessage("Body is required !"),
   body("description").notEmpty().trim().withMessage("Description is required !")
]

module.exports.updatePost = async (req, res) =>
{
   const { title, description, body, id } = req.body;
   const errors = validationResult(req);
   if(!errors.isEmpty())
   {
      return res.status(400).json({ errors : errors.array() });
   }
   else
   {
      try
      {
         console.log("Current Id : " + id);
         const response = await Post.findByIdAndUpdate(id, {
            title, 
            description,
            body
         });
         
         return res.status(200).json({ msg : "Your post has been updated !" });
      }
      catch(error)
      {
         return res.status(400).json({ errors : error, msg : error.message });
      }
   }
}

module.exports.updatePostImage = (req, res) =>
{
   const form = formidable({ multiples : true });
   form.parse(req, async (error, fields, files) => {
      let imageErrors = [];
      console.log(fields);
      if(Object.keys(files).length === 0)
      {
         imageErrors.push({ msg : "Please choose image !" });
      }
      else
      {
         const type = files.image.mimetype;
         const split = type.split("/");
         const extension = split[1];
         if(extension !== "jpg" && extension !== "jpeg" && extension !== "png")
         {
             imageErrors.push({ msg : `.${extension} is not a valid extension !` });
         }
         else
         {
            // We have image with proper extension
            // If name of the image is duplicate then there will be problem use uuid to generate random number
            files.image.newFilename = uuidv4() + "." + extension;
         }
      }
      
      if(imageErrors.length !== 0)
      {
         return res.status(400).json({ errors : imageErrors });
      }
      else
      {
         const newPath = path.join(__dirname , `../../../client/src/uploads/${files.image.newFilename}`);
         
         fs.copyFile(files.image.filepath, newPath, async (error) => {
            if(!error)
            {
              try
              {
               // Deleting existing file first.
                 /*const deleteRes = await Post.findById(fields.id);
                  fs.unlink(path.join(__dirname , `../../client/src/uploads/${deleteRes.image}`), async (error) => {
                     if(!error)
                     {
                        const response = await Post.findByIdAndUpdate(fields.id, {
                           image : files.image.newFilename
                        });
                        return res.status(200).json({ msg : "Post image has been updated successfully !", response });
                     }
                  });*/
                  
                  const response = await Post.findByIdAndUpdate(fields.id, {
                     image : files.image.newFilename
                  });
                  return res.status(200).json({ msg : "Post image has been updated successfully !", response });
                  
              }
              catch(error)
              {
               console.log(error);
                 return res.status(500).json({ errors : error, msg : error.message })
              }
            }  
      }
      )}
   });
}

module.exports.deletePost = async (req, res) =>
{
   const { id } = req.params;
   console.log(id);
   try
   {
      // Deleting existing file first.
      /*const deleteRes = await Post.findById(id);
      fs.unlink(path.join(__dirname , `../../client/src/uploads/${deleteRes.image}`), async (error) => {
         if(!error)
         {
            const response = await Post.findByIdAndRemove(id);
            return res.status(200).json({ msg : "Your post has been deleted successfully !" });
         }
      });*/
      const response = await Post.findByIdAndRemove(id);
      return res.status(200).json({ msg : "Your post has been deleted successfully !" });
      
   }
   catch(error)
   {
      return res.status(400).json({ errors : error, msg : error.message });
   }
}

module.exports.allPosts = async (req, res) => 
{
   const { page } = req.params;
   const perPage = 7;
   const skip = (page - 1) * perPage;
   
   try
   {
      const count = await Post.find({}).countDocuments();
      const response = await Post.find({}).limit(perPage).skip(skip).sort({ updatedAt : -1 }).populate("user", "_id firstName lastName email profilePicture");
      return res.status(200).json({ response, perPage, count });
   }
   catch(error)
   {
      return res.status(400).json({ errors : error, msg : error.message });
   }
}

module.exports.fetchDetails = async (req, res) => 
{
    const { id } = req.params;
    
    try
    {
      const response = await Post.find({ slug : id }).populate("user", "_id firstName lastName email profilePicture");
      const post = response[0];
      const comments = await Comment.find({ postId : post._id }).sort({ updatedAt : -1 }).populate("user", "_id firstName lastName email profilePicture");
      return res.status(200).json({ post, comments });
    }
    catch(error)
    {    
      return res.status(400).json({ errors : error, msg : error.message });
    }
}

module.exports.postComment = async (req, res) =>
{
   const { postId, comment, user } = req.body;
   let errors = [];
   try
   {
      if(comment === "")
      {
         errors.push({ msg : "Comment is required !" });
      }
      if(errors.length > 0)
      {
         return res.status(200).json({ errors });
      }
      
      const response = await Comment.create({
         postId,
         user, 
         comment
      });
      
      return res.status(200).json({ msg : "Comment posted successfully !", response });
   }
   catch(error)
   {
      return res.status(400).json({ errors : error, msg : error.message });
   }
}