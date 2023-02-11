const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
     type:String
    },
    url:{
     type:String
    },
    mobile: {
        type: Number
    },
    password:{
   type:String
    },
    role:{
        type:String,
        default:"user"
    },
    balance:{
        type:Number,
        default:0
    },
    api_key:{
        type:String,
    },
    api_id:{
        type:String,
    },
    rank:{
        type:Number,
        default:0
    }
});
const model = mongoose.model("alluser", userSchema)

module.exports = model;