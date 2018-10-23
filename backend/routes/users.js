const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
// install a package bcrypt to encrypt the password which doesn't decrypt for password protection;

router.post("/signup",(req,res,next) => {
    bcrypt.hash(req.body.password,10)
    .then(hash=>{
        const user = new User({
            email : req.body.email,
            password: hash
        });
        user.save().then((result)=>{
            res.status(201).json({
                message:'user created',
                result:result
            })
        })
        .catch(err=>{
            res.status(500).json({
                message:'error occoured',
                result:err
            })
        })
    })
    
});


router.post("/login",(req,res,next)=>{
    let fetchedUser;
    User.findOne({email:req.body.email}).then((user)=>{
       
        if(!user){
            return res.status(401).json({
                message:'Áuth Failed'
            })
        }
        console.log(user)
        fetchedUser=user;

        return bcrypt.compare(req.body.password,user.password); // used to compare the hash password with the request password
    })
    .then((result)=>{
        //console.log(result)
        console.log(fetchedUser)
        if(!result){
            return res.status(401).json({
                message:'Áuth Failed'
            })
        }
       
        const token = jwt.sign(
            {email:fetchedUser.email,userId:fetchedUser._id},
            'secret_thi_should_be_longer',
            {expiresIn:'1hr'}
            )   // to create the jwt token
           
            res.status(200).json({
                message:'Authenticate Valid',
                token :token,
                expiresIn:3600
            })
    })
    .catch(err=>{
        return res.status(401).json({
            message:'Áuth Failed'
        })
    })
})




module.exports= router;