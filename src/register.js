const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
    },
    lastName: {
        type: String,
        required:true,
    },
    Email: {
        type: String,
        required:true,
        unique:true,
    },
    Enter_age: {
        type: Number,
        required:true,
    },
    phoneNumber: {
        type: Number,
        required:true,
        unique:true
    },
    Password:{
        type: String,
        required:true,
    },
    ConfirmPassword: {
        type: String,
        required:true,
    },
    PasswordResetToken:{
        type: String,
    },
    PasswordResetExpires: {
        type: Date,
    }


})

userSchema.pre("save",async function(next){  
    // console.log(`the before password is ${this.Password}`);
    // console.log(`the after password is ${this.Password}`);
    if(this.isModified("Password")){
        
        this.Password = await bcrypt.hash(this.Password, 10);

        this.ConfirmPassword = undefined;
    }
    next();
})

userSchema.methods.CreatePasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.PasswordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log(`${resetToken}`);
    console.log(`${this.PasswordResetToken}`);

    this.PasswordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const Registering = new mongoose.model("Registering",userSchema);

module.exports = Registering;