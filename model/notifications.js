const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Message: {
        type: String,
        required: true
    },
    public_id:{
        type:String
    },
    url:{
        type:String
    },
    to:{
        type:String
    }
});
const model = mongoose.model("notification", userSchema)

module.exports = model;