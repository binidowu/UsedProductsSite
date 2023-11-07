const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    pictures: [{
        url: { type: String, required: true },
        filename: { type: String },
    }],
    description: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

module.exports = mongoose.model('Ad', adSchema);
