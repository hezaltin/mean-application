const path = require('path')
const express = require('express'); // importing the express module

const bodyParser = require("body-parser") // used tp parse the request body of post request
const mongoose = require("mongoose");
const postRoutes =  require ("./routes/posts");
const userRoutes = require ("./routes/users");

const app = express(); //setting  the export module as app

mongoose.connect("mongodb+srv://michael:NahzbJq15c07QVt3@cluster0-hjch1.mongodb.net/node-angular?retryWrites=true", { useNewUrlParser: true }).then(() => {
    console.log('mongo db connected:)');
}).catch((error) => {
    console.log(error)
    console.log('mongo db Error:(');
});
app.use(bodyParser.json());  // method parse it in json
app.use(bodyParser.urlencoded({ extended: false }));  // method encoded the url
app.use("/images", express.static(path.join("backend/images"))) //any req targeting /images will allow to fetch the server image in the images folder

// setting the header for CROS wil call each time before the execution because next() is used to stream down the other use/ post/ get method;
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested,Content-Type,Accept'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    next();
});

app.use("/api/posts",postRoutes);
app.use("/api/users",userRoutes);

module.exports = app; // exporting the app module;