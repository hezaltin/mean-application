const express = require ('express');
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth')
const multer = require ('multer'); // server side image uploading;

const router = express.Router();
const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg' :'jpg',
    'image/jpg' : 'jpg'
}
// To Store the image from multer
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        const isValid =  MIME_TYPE[file.mimetype];
        let error = new Error('Invalid mime type');
        if(isValid){
            error = null;
        }
      cb(error,'backend/images'); 
    },
    filename: (req,file,cb) =>{
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext =  MIME_TYPE[file.mimetype];
        cb(null,name + '-' + Date.now() + '.' + ext) // create a unique extention

    }
});

// use for post request;multer middleware to parse the body and find the sing propert 'image';
router.post('',checkAuth,multer({storage:storage}).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    post.save().then((createdPost)=>{
        console.log(post);
        res.status(201).json({
            message: 'Post added Sucessfully',
            post :{
                ...createdPost,
                id: createdPost._id
            }  
        });
    });
    
})
// we can use get insted of use method
router.get('', (req, res, next) => {
    // const post = [
    //     { 
    //         id: 1, 
    //         title: 'first post', 
    //         content: 'this is my first post from server' 
    //     },
    //     { 
    //         id: 2, 
    //         title: 'second post', 
    //         content: 'this is my second post from server'
    //     }
    // ];
    
    console.log(req.query)
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const pageQuery =  Post.find();
    let fetchPosts;
    if(pageSize && currentPage){
        pageQuery.skip(pageSize * (currentPage - 1))
        .limit(pageSize)
    }
    pageQuery.then((documents) => {
        fetchPosts = documents;
       return Post.count();
    }).then((count=>{
        console.log(count)
        console.log(fetchPosts)
        res.status(200).json({
            message: 'Posts fetches successfully',
            posts: fetchPosts,
            maxPosts: count
        })
    }))

});

router.put('/:id',checkAuth,multer({storage:storage}).single('image'),(req,res,next)=>{
    console.log("req.body===>",req.body)
    let imagePath = req.body.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + "/images/" + req.file.filename
    }
        const post = new Post({
            _id: req.body.id,
            title:req.body.title,
            content: req.body.content,
            imagePath:imagePath
        })
        console.log(post)
        Post.updateOne({_id:req.params.id},post).then((result)=>{
            console.log(result);
            res.status(200).json({
                message: "Update Data Successfully"
            })
        })
});

router.get('/:id',(req,res,next)=>{
        Post.findById(req.params.id).then((post)=>{
            if(post){
                res.status(200).json(post)
            }else{
                res.status(404).json({message:'Post Not Found'})
            }
        })
})

router.delete('/:id',checkAuth,(req,res,next)=>{
    console.log(req.params.id);
    Post.deleteOne({_id:req.params.id}).then((result)=>{
        console.log(result);
        res.status(200).json({
            message: 'Sucessfully Deleted!!',
        })
    });
    
});

module.exports = router;
