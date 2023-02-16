const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"alluser"
   }
   ,
    url:{
        type:String,
        required:true
    },
    public_id:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"pending"
    }
});
const model = mongoose.model("depositrequest", userSchema)

module.exports = model;