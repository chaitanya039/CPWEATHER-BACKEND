const express = require("express");
const postRoutes = express.Router();
const { createPost, fetchPosts, fetchPost, updatePost, updatePostImage, updatePostValidations, fetchDetails, deletePost, allPosts, postComment } = require("../controllers/createPostController");
const auth = require("../utils/auth");

postRoutes.post("/create-post", auth ,createPost);
postRoutes.get("/posts/:id/:page", auth, fetchPosts);
postRoutes.post("/post/update", [auth, updatePostValidations], updatePost);
postRoutes.post("/post/updateImage", auth, updatePostImage);
postRoutes.get("/post/:id", auth, fetchPost);
postRoutes.get("/post/delete/:id", auth, deletePost);
postRoutes.get("/posts/:page", allPosts);
postRoutes.get("/details/:id", fetchDetails);
postRoutes.post("/details/comment", auth, postComment);


module.exports = postRoutes;