const Photo = require('./../models/Photo');
//const moment = require('moment');

const GetScreen = (req, res) => {
    const {user_id, date} = req.body;
//    let from_dt = new Date(moment(date).format('YYYY-MM-DD 00:00:00'));
//    let to_dt = new Date(moment(date).format('YYYY-MM-DD 24:00:00'))

    //Photo.find({user_id})
    
}

const GetImage = (req, res) => {
    const imageName = req.params.imageName;
    let lastIndex = __dirname.lastIndexOf("\\");
    let dir = __dirname.slice(0, lastIndex);
    return res.sendFile(`${dir}/photos/${imageName}`);
}

const GetAvatar = (req, res) => {
    const imageName = req.params.imageName;
    let lastIndex = __dirname.lastIndexOf("\\");
    let dir = __dirname.slice(0, lastIndex);
    return res.sendFile(`${dir}/avatars/${imageName}`);
}

const GetBrnad = (req, res) => {
    const imageName = req.params.imageName;
    let lastIndex = __dirname.lastIndexOf("\\");
    let dir = __dirname.slice(0, lastIndex);
    return res.sendFile(`${dir}/brands/${imageName}`);
}

module.exports = {
    GetScreen,
    GetImage,
    GetAvatar,
    GetBrnad
}