const mongoose = require("mongoose");
const schema =new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    fullName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique: true,
         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
         required:true
        }
        ,
        image:{
            type:String,
            required:true
        }
        ,
    
    role: { type: String, enum: ['admin', 'teacher'], required: true},
})
module.exports = mongoose.model("teachers",schema);
