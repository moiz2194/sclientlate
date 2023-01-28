const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: 
        {
            public_id:{
                type:String
            },
            url:{
                type:String
            }
        }
    
});
const model = mongoose.model("category", userSchema)

module.exports = model;