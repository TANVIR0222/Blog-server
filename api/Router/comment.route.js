const express = require('express');
const Comment = require('../Model/comment.model');

const router = express.Router();


// post new comment 
router.post('/post-comment', async(req, res) => {
    console.log(req.body);
    try {
        const id = req.body;
        const commentPost = new Comment(id)
        await commentPost.save();
        res.status(200).send({ message: "comment uplodate", posts: commentPost });

    } catch (error) {
        console.log('Error fetching comment post :', error);
        res.status(500).send({ message: "Error fetching comment post" });
    }
    
})

// get all comment 
router.get('/test-comment', async(req,res) =>{

    try {
        const totalComments = await Comment.countDocuments({})
        res.status(200).send({ message: " Total comment count", posts: totalComments });

    } catch (error) {
        console.log('Error  all  comment post', error);
        res.status(500).send({ message: "Error get fetching all comment post" });
    }

})

module.exports = router;
