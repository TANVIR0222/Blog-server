const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


// router
const blogRouter = require("./router/blog.route");
const connect = require("./DB/connect");
const commentRouter = require("./Router/comment.route");
const authRouter = require("./Router/user.auth.route");
// mi
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


const port = process.env.PORT || 3000


app.get('/' , (req,res) => {
    res.send('hello')
})

app.listen(port, () => {
    console.log(`listens on port ${port}`);
    connect();
})

app.use('/api/blogs', blogRouter)
app.use('/api/comments', commentRouter)
app.use('/api/auth', authRouter)