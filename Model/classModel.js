const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);


const schema =new mongoose.Schema({
    _id:{
        type:Number,
    },
    name:{
        type:String,
        required:true
    },
    supervisor:{
        ref:"teachers",
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    children:{
        type: [Number],
        required:true,
        ref:"childern"
    }
},{ _id: false })
schema.plugin(AutoIncrement,{
    id: 'class_counter',});
    // inc_field: "_id"


module.exports = mongoose.model("classes",schema);