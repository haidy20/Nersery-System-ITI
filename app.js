// app.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const multer = require("multer");
const path= require("path");
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

// const cors=require("cors");
const login=require("./Routes/authentication");
const authenticationMW = require("./Core/authenticationMW");
const teacherRoute=require("./Routes/teacherRoute");
const childRoute=require("./Routes/childRoute");
const classRoute=require("./Routes/classRoute");
const swaggerSpec = require('./swaggerConfig');

// image variable
const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        console.log(path.join(__dirname,"images"));
       cb(null,path.join(__dirname,"images"))
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toLocaleDateString().replace(/\//g,"-")+"-"+file.originalname)
    }
})
const fileFilter=(req,file,cb)=>{
   if(file.mimetype=="image/jpeg" || 
   file.mimetype=="image/jpg" ||
    file.mimetype=="image/png") 
cb(null,true)
else
cb(null,false)
}

// default function create server
const server = express();
 

// setting port number
let port = process.env.PORT || 8080; 

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/nursrySystemDB")
        .then(()=>{
            console.log("DB Connected");
            server.listen(port,()=>{
            console.log("server is listenng.....",port);
});
        })
        .catch((error)=>{
            console.log("DB Problem: "+error);
        })

// Middleware for CORS
// const Cors = {
//     origin: 'http:localhost:8080',
//     methods: ['POST']
//   };
// server.use(cors(Cors));


////////////////////Structure////////////////
server.use((request,response,next)=>{
    console.log(request.url,request.method);
    next();
});

////////////////////End Points(Routes)////////////////
server.use("/images",express.static(path.join(__dirname,"images")));
server.use(multer({storage,fileFilter}).single("image"))
server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
server.use(login);
server.use(authenticationMW);
server.use(teacherRoute);
server.use(childRoute);
server.use(classRoute);



//Not found MW
server.use((request,response)=>{
    response.status(404).json({message:"Not Found !!!!"});
});
//Error MW
server.use((error,request,response,next)=>{
    let status=error.status||500;
    response.status(status).json({message:error+""});
})

