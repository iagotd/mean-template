const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type     : Number,
        required : true,
        validate : {
          validator : Number.isInteger,
          message   : '{VALUE} is not an integer value'
        }
    }
})

module.exports = mongoose.model('user', userSchema, 'users')