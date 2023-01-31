const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    }
});
const model = mongoose.model("alluser", userSchema)

module.exports = model;