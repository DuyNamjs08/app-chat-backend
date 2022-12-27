const UserSchema = require('../models/user.model')
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);


const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const usernameCheck = await UserSchema.findOne({ username })
        if (usernameCheck) {
            return res.json({ msg: "Username is already used", status: false })
        }
        const emailCheck = await UserSchema.findOne({ email })
        if (emailCheck) {
            return res.json({ msg: "Email is already used ", status: false })
        }
        const hassPass = await bcrypt.hash(password, salt)
        const createUser = await UserSchema.create({
            username,
            email,
            password: hassPass
        });
        delete createUser.password
        return res.json({ status: true, createUser })

    } catch (error) {
        next(error)
    }
}
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await UserSchema.findOne({ username })
        if (!user) {
            return res.json({ msg: 'Username or password is incorrect !', status: false })
        }
        const isPassword = await bcrypt.compareSync(password, user.password)
        if (!isPassword) {
            return res.json({ msg: 'Username or password is incorrect !', status: false })
        }
        delete user.password
        return res.json({ status: true, createUser: user })

    } catch (error) {
        next(error)
    }
}
const setAvatar = async (req, res, next) => {
    try {
        const userId = req.params
        const avatarImage = req.body.image;
        const userData = await UserSchema.findByIdAndUpdate(userId.id, {
            isAvatarImgSet: true,
            avatarImage: avatarImage
        }, {
            new: true
        })
        return res.json({
            isSet: userData.isAvatarImgSet,
            image: userData.avatarImage,
        });

    } catch (error) {
        next(error)
    }
}
const getAllUser = async (req, res, next) => {
    try {
        // console.log(req.params)
        const users = await UserSchema.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        // console.log(users)
        return res.json(users)
    } catch (error) {
        next(error)
    }
}

module.exports = { register, login, setAvatar, getAllUser }