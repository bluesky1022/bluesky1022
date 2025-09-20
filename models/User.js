const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    id:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    avatar:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    group_id:{
        type: Schema.Types.ObjectId,
        ref:'groups'
    }
});

module.exports = UserModel = mongoose.model('users', UserSchema);
