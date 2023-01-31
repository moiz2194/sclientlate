const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name:{
        type:String
    },
    mobile:{
        type:String
    },
    amount:{
        type: Number,
        required: true
    },
    type:{
        type: String,
        required: true
    }
    ,
    status:{
        type: String,
       default:"pending"
    }
    ,
    Date:{
        type: Date,
        default:Date.now()
    },
    
    
});
const model = mongoose.model("history", userSchema)

module.exports = model;