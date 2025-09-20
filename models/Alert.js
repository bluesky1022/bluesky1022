const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AlertSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        ref:'users'
    },
    action_time:{
        type:Number,
        required:true
    },
    type:{
        type:Boolean,
        required:true
    }
})

module.exports = AlertModel = mongoose.model('alerts', AlertSchema);