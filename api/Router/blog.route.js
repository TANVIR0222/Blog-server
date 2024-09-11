const express = require("express");
const Blog = require("../model/blog.model");
const Comment = require("../Model/comment.model");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();
//
router.post("/create-post", async (req, res) => {
  try {
    const newPost = new Blog({ ...req.body , author: req.userId }); 
    await newPost.save();

    res.status(200).send({ message: "Post successful" });
  } catch (error) {
    console.log("contant post error", error);
    res.status(500).send({ message: "Error creating content" });
  }
});

//
router.get("/", async (req, res) => {
  try {
    const { search, category, location } = req.query;
    console.log(search);

    let query = {};

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (category) {
      query = {
        ...query,
        category,
      };
    }

    if (location) {
      query = {
        ...query,
        location,
      };
    }

    const post = await Blog.find(query)
      .populate("author", "email")
      .sort({ createdAt: -1 });
    res.status(200).send({ message: " all Post successful ", posts: post });
  } catch (error) {
    console.log("contant post error", error);
    res.status(500).send({ message: "Error creating content" });
  }
});

// get dingle id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Blog.findById(id);

    const comment = await Comment.find({ id: id }).populate(
      "user",
      "username email"
    );

    res.status(200).send({ message: "this user", posts: post });
  } catch (error) {
    console.log("single user search faild ", error);
    res.status(500).send({ message: "single user search faild" });
  }
});

// update a post
router.patch("/update-post/:id", verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findByIdAndUpdate(
      postId,
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(200).send({ message: "Update now", posts: post });
  } catch (error) {
    console.log("Update faild ", error);
    res.status(500).send({ message: "update faild user" });
  }
});

// delete api
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    // delete commet api

    await Comment.deleteMany({ postId: postId });
    const deletePost = await Blog.findByIdAndDelete(postId);
    res.status(200).send({ message: "Delete Bloge", posts: deletePost });
  } catch (error) {
    console.log("Dlelete faild ", error);
    res.status(500).send({ message: "Dlelete faild Blog" });
  }
});

// realted api

router.get("/realted/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ message: "post id is required" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(400).send({ message: "post  is Not found " });
    }

    const titelRegex = new RegExp(blog.title.split(" ").join("|"), "i");

    const relatedQuery = {
      _id: { $ne: id }, //exclude the current blog by id
      title: { $regex: titelRegex },
    };

    const relatedPost = await Blog.find(relatedQuery);
    res.status(200).send({ message: "Related  Blog", posts: relatedPost });
  } catch (error) {
    console.log("Error fetching related post :", error);
    res.status(500).send({ message: "Error fetching related post" });
  }
});

module.exports = router;
