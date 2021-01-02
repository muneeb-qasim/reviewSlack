const {
    User,
    validate,
    validated
} = require('../model/user');
const Bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/key');

router.post('/signup', async(req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) {
        return res.json({
            error: error.details[0].message,
        });
    }
    const savedUser = await User.findOne({
        email: req.body.email,
    });

    if (savedUser) {
        return res.json({
            already: 'Email already registered!',
        });
    }
    const hashedPassword = await Bcrypt.hash(req.body.password, 12);

    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
    });
    await user.save();
    res.json({
        message: 'Registered Successfully!',
    });
});

router.post('/signin', async(req, res) => {
    const {
        error
    } = validated(req.body);
    if (error) {
        return res.json({
            error: error.details[0].message,
        });
    }
    const registeredUser = await User.findOne({
        email: req.body.email,
    });

    if (!registeredUser) {
        return res.json({
            already: 'Invalid Email or Password',
        });
    }
    const matchPass = await Bcrypt.compare(
        req.body.password,
        registeredUser.password
    );
    if (!matchPass) {
        return res.json({
            already: 'Invalid Email or Password',
        });
    }

    const jwtToken = jwt.sign({
            email: registeredUser.firstname,
            id: registeredUser._id,
        },
        config.secret
    );
    res.json({
        token: jwtToken,
        msg: registeredUser,
    });
});

module.exports = router;