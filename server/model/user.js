const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        firstname: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        lastname: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 5,
            maxlength: 50,
        },
        password: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 500,
        },
    })
);

function validateUser(user) {
    const schema = Joi.object({
        firstname: Joi.string().min(4).max(50).required(),
        lastname: Joi.string().min(4).max(50).required(),
        email: Joi.string().email(),
        password: passwordComplexity(),
    });

    return schema.validate(user);
}

function validateUserSignin(user) {
    const schema1 = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    return schema1.validate(user);
}

exports.User = User;
exports.validate = validateUser;
exports.validated = validateUserSignin;