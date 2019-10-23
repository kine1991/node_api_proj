const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'moderator', 'company'],
        default: 'user'
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password should be more then 6 symbols'],
        select: false //не выводиться из базы данных
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator: function(el){
                return el === this.password; // this будеть работать только при сохранении (.create() .save()) update find не подходят
            },
            message: 'field confirm passsword do not match the same'
        }
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now()
        // require: [true, 'Please tell us your date!']
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next(); // isModified - если поле измениловсь
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

  
userSchema.pre('save', async function(next) {
if (!this.isModified('password') || this.isNew) return next();

this.passwordChangedAt = Date.now() - 1000;
next();
});

userSchema.pre(/^find/, function(next) {
    // this point to current query
    this.find({active: { $ne: false }});
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function(iat){
    if(this.passwordChangedAt){
        const passwordChangedAtDevidedByThousand = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return passwordChangedAtDevidedByThousand > iat;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex'); // создаем рандомный токен
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // хешируем его
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}; 

const User = mongoose.model('User', userSchema)

module.exports = User;