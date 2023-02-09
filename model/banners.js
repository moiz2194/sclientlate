const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },

});
const model = mongoose.model("banner", userSchema)

module.exports = model;