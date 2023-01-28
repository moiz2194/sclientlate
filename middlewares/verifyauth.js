const jwt =require("jsonwebtoken");
const User = require("../model/user.js");
const ErrorHander =require("./errorhandler.js");
 function verifyToken(req, res, next){
  let token = req.header("Authentication");
  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }
  jwt.verify(token,'moiz2194', (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: err });
    }
    req._id = decoded.id;
    next();
  });
};

 async function isadmin(req,res,next){
  const id=req._id;
  const user=await User.findById(id);
  if(user===null){
    return next(new ErrorHander('Login to continue', 405));

  }
  if(user.role!=='admin'){
    return next(new ErrorHander('Unauthorized', 401));

  }
  next()
}

module.exports={isadmin,verifyToken}