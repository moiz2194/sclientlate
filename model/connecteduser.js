const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    socket_id: {
        type: String,
    },
    user_id:{
        type: String,
    }
});
const model = mongoose.model("connectedUser", userSchema)

module.exports = model;