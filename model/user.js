const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number
    },
    role:{
        type:String,
        default:"user"
    },
    balance:{
        type:Number,
        default:0
    }
});
const model = mongoose.model("alluser", userSchema)

module.exports = model;