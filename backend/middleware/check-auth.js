const jwt = require ("jsonwebtoken");


module.exports = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token,'secret_thi_should_be_longer');
        req.userData = {email : decodedToken.email, userId: decodedToken.userId}
        // every method running after the checkAuth middleware will get the userdata from the req
        next();
    }
    catch(error){
        res.status(401).json({
            message: 'Auth Failed'
        })
    }
}