const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    stream_id: {
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true
    }
});
const model = mongoose.model("favourite", userSchema)

module.exports = model;