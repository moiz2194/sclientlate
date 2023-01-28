const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: [
     {
     value:{
        type:String
     }
     }
    ],
    totalamount:{
        type:Number
    }
});
const model = mongoose.model("question", userSchema)

module.exports = model;