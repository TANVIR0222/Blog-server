const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../Model/user.model");
const generateToken = require("../middleware/generateToken");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(200).send({ message: " user create success  ", posts: newUser });
  } catch (error) {
    console.log(" Register faild s :", error);
    res.status(404).send({ message: "Register faild " });
  }
});

// login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isMatch = await user.comparePassowrd(password);

    if (!user) {
      res.status(404).send({ message: "user not found " });
    }

    if (!isMatch) {
      res.status(401).send({ message: "password not found " });
    }

    const token = await generateToken(user._id)

    res.cookie('token', token,{
      httpOnly:true,
      secure:true,
      sameSite:true
    })
    
    res.status(200).send({ message: " login  success  ", token, user: {
      _id: user._id,
      email: user.email,
      password: user.password,
      role: user.role,
    }, });
   
  } catch (error) {
    console.log(" login faild :", error);
    res.status(404).send({ message: "login faild " });
  }
});

// logout

router.post('/logout',async(req,res) =>{
  try {
    res.clearCookie('token');
    res.status(200).send({ message: " logout  success  " });
  } catch (error) {
    console.log(" login out faild :", error);
    res.status(404).send({ message: "login out faild " });
  }
})


// all user get 
router.get('/user', async (req,res)=>{
  try {
     const allUser = await User.find({},  'id email role ');
     res.status(200).send({ message: " user found  success  " ,allUser});

  } catch (error) {
    console.log(" all user get faild :", error);
    res.status(404).send({ message: "all user get faild " });
  }
})

// delete user 
router.delete('/user/:id' , async(req,res) =>{
  try {

    const {id} = req.params;
    const user = await User.findByIdAndDelete(id)

    if(!user) return res.status(404).send({ message: "user not found" });

    res.status(200).send({ message: " delete user success " ,user});

    
  } catch (error) {
    console.log(" Delete  faild :", error);
    res.status(404).send({ message: "Delete faild " });
  }
})

router.put('/users/:id', async(req,res) =>{
  try {
    const {id} = req.params;
    const {role} = req.body;
    const user = await User.findByIdAndUpdate(id,{role} ,{new : true});

    if (!user) {
      res.status(404).send({ message: "user not found " });
    }
    res.status(200).send({ message: " delete user success " ,user});

  } catch (error) {
    console.log(" Delete  faild :", error);
    res.status(404).send({ message: "Delete faild " });
  }
})

module.exports = router;

