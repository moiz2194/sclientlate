const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    public_id:{
        type: String
    },
    url:{
        type: String
    },
    rank:{
        type: Number,
        default: 0
    },
    gifts:[
        {
            amount:{
                type:String
            },
            user_name:{
                type:String
            },
        }
    ]
});
const model = mongoose.model("streamer", userSchema)

module.exports = model;