const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    title: {
        type: String
    },
    url: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true
    },
    question_id: [
        {
            type: String
        }
    ],
    thumbnail: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    trend: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    streamer_name: {
        type: String,
        required: true
    },
    streamer_id: {
        type: String,
        required: true
    }
});
const model = mongoose.model("stream", userSchema)

module.exports = model;