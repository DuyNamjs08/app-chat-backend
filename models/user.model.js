const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        min:5,
        max:30,
        required:true,
        unique:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        max:50
    },
    password:{
        type:String,
        min:6,
        required:true
    },
    isAvatarImgSet:{
     type:Boolean,
     default:false
    },
    avatarImage:{
        type:String,
        default:""
    }
})

module.exports = mongoose.model("Users" , userSchema)