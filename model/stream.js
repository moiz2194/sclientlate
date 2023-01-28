const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    category:{
     type: String,
     required: true
    },
    category_id:{
     type: String,
     required: true
    },
    question_id: {
        type: String,
        requried:true
    },
    thumbnail: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    }
});
const model = mongoose.model("stream", userSchema)

module.exports = model;