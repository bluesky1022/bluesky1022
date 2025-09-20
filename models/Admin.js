const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdminSchema = new Schema({
    id:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

module.exports = AdminModel = mongoose.model('admins', AdminSchema);