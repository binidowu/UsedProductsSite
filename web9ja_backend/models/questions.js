const mongoose = require('mongoose');

// const questionSchema = new mongoose.Schema({
//     content: {
//         type: String,
//         required: true
//     },
//     ad: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Ad',
//         required: true
//     },
//     asker: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     answer: {
//         content: { type: String, default: '' },
//         answeredAt: { type: Date }
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    askedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    answerText: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', questionSchema);
