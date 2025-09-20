const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GroupSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    time_interval:{
        type: Number,
        required:true
    },
    brand:{
        type: String
    }
});

module.exports = GroupModel = mongoose.model('groups', GroupSchema);