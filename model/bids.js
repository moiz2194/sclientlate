const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    question_id: {
        type: String,
        required: true
    },
    stream_id: {
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    answer_id:{
        type: String,
        required: true
    },
    answer:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    status:{
        type:String,
        default:"pending"
    },
    amount_won:{
        type:String,
        default:0
    }
});
const model = mongoose.model("bid", userSchema)

module.exports = model;