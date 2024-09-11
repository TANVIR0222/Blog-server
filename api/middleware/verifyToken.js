const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) => {
   try {
    // const token = req.cookie.token;
    const token = req.header.authorization.split(' ')[1];

    if(!token){
        res.status(200).send({ message: " No Token Provide "});
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
        res.status(401).send({ message: "Unauthorized"});

    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
   } catch (error) {
    console.log(" Error verify Token :", error);
    res.status(404).send({ message: "Error verify Token " });
   }
};

module.exports = verifyToken;
