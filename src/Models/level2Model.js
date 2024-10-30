const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionNumber: {
        type: Number,
        required: false,
        unique: true,
        index: true
    },
    statement: {
        type: String,
        required: false
    },
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctOption: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

questionSchema.pre('save', async function(next) {
    if (!this.questionNumber) {
        const latestQuestion = await this.constructor.findOne().sort('-questionNumber');
        this.questionNumber = latestQuestion ? latestQuestion.questionNumber + 1 : 1;
    }
    next();
});

module.exports = mongoose.model('Level2Question', questionSchema);
