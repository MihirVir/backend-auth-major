const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerUser  = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const salt = bcrypt.genSaltSync(14);
        const hash = bcrypt.hashSync(password, salt)
        // find user
        const findingUser = await User.findOne({username});

        if (findingUser) {
            return res
                    .status(400)
                    .json({
                        message: "user already exists"
                    });
        }
        // create user
        const newUser = new User({
            username: username,
            password: hash
        });
        await newUser.save();
        const token = jwt.sign({
            username: newUser.username, id: newUser._id
        }, 'abc', {expiresIn: "3d"});

        return res.status(201).json({token: token});
    } catch (err) {
        console.log(err);
        return res   
                .status(500)
                .json({
                    message: "Internal Server Error"
                })
    }
}

const loginUser = async (req,res) => {
    try {
        const {
            username,
            password
        } = req.body;

        const existingUser = await User.findOne({username});

        if (!existingUser) {
            return res
                    .status(404)
                    .json({
                        message: "User Not Found"
                    })
        }

        const comparePassword = await bcrypt.compare(password, existingUser.password);

        if (!comparePassword) {
            return res 
                    .status(400)
                    .json({
                        message: "Incorrect password or username"
                    });
        }

        const token = jwt.sign({username: existingUser.email, id: existingUser._id}, "abc", {expiresIn: '3d'});

        return res
                .status(201)
                .json({token: token});
    } catch (err) {
        return res
                .status(500)
                .json({
                    message: "Internal Server Error"
                })
    }
}

module.exports = {
    registerUser,
    loginUser
}