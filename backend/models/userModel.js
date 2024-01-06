const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    email: { type: String, unique:true, required:true },
    password: { type: String, min:6 ,  required:true },
    userType:{type:String  , required:true },
    token: { type: String, required: false }
})

module.exports = mongoose.model('user', userSchema)