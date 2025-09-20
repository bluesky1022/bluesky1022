const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PhotoSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    recv_time:{
        type:Number,
        required:true
    },
    interval:{
        type:Number,
        required:true
    },
    imageName: {
        type: String,
        required: true
    }
});

module.exports = PhotoModel = mongoose.model('photos', PhotoSchema);
