const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        _id: {
            type: mongoose.Schema.Types.String,
            required: true
        },
        nameFirst: {
            type: mongoose.Schema.Types.String,
            required: true
        },
        nameMiddle: {
            type: mongoose.Schema.Types.String,
            default: '',
        },
        nameLast: {
            type: mongoose.Schema.Types.String,
            required: true
        },
        userName: {
            type: mongoose.Schema.Types.String,
            required: true
        },
        purchased: {
            type: mongoose.Schema.Types.Boolean,
            default: false,
        },
        country: {
            type: mongoose.Schema.Types.String,
            required: true,
        },
        birth: {
            type: mongoose.Schema.Types.String,
            required: true,
        },
        followers: {
            type: [mongoose.Schema.Types.String],
            default: []
        },
        languages: {
            type: [mongoose.Schema.Types.String],
            default: ['en']
        },
        deleted: {
            type: mongoose.Schema.Types.Boolean,
            default: false,
        },
    },
    { 
        timestamps: { createdAt: true, updatedAt: false },
        toJSON: { versionKey: false }, 
        toObject: { versionKey: false } 
    }
);

module.exports = mongoose.model('User', userSchema);