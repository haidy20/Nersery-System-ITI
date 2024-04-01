// create schema object
const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const addressSchema =new mongoose.Schema({
    city: {
        type:String,
        required:true
    },
    street: {
        type:String,
        required:true
    },
    building: {
        type:Number,
        required:true
    }
})
// build schema
const schema =new mongoose.Schema({
    _id:{
        type:Number
    },
    fullName:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true,
        min:0,
        // max:12
    },
    level:{
        type: String,
        required:true,
        enum: ['PreKG','KG1','KG2']
    },
    address: {
        type:addressSchema,
        required:true
    }
    /////////////////
    ,
    image:{
        type:String,
        required:true
    }

},{ _id: false })
schema.plugin(AutoIncrement,{
    id: 'child_counter'});
    //  inc_field: "_id"
 

    //2- register for schema in mongoose
module.exports = mongoose.model("childern",schema);