const Photo = require('./../models/Photo');
const User = require('./../models/User');
const moment = require('moment');
const Group = require('./../models/Group');
const Alert = require('./../models/Alert');

let timeout = {};
const uploadFile_photo = require("../config/middleware").uploadFileMiddleware_photo;

const sendAlert = data => {
    eventEmitter.emit('lazy', data);
    const alert = new Alert({
        action_time:Date.parse(new Date()),
        user_id: data.id,
        type:false
    })
    alert.save()
}

const GetPhotoData =  (req, res) => {
    const date = req.body.date;
    let from_dt = Date.parse(moment(date).format('YYYY-MM-DD 00:00:00'));
    let to_dt = Date.parse(moment(date).format('YYYY-MM-DD 24:00:00'));

    //get whole user data
    let results = [];
    User.find({})
        .then(async users =>{
            for(let i = 0 ; i < users.length ; i ++){
                await Photo.find({recv_time:{$gt:from_dt, $lt:to_dt}, user_id: users[i]._id})
                            .then(photos => {
                                const userInfo = {
                                    userData: users[i],
                                    photo_array: photos
                                }
                                results.push(userInfo);
                            })
            }
            return res.json(results)
        })
}

const ImageSave = async (req, res) => {
    try {
        
        await uploadFile_photo(req, res);
        const {user_id, interval, imageName} = req.body;
        let time = new Date();
        const photo = new Photo({
            user_id,
            interval,
            imageName,
            recv_time:Date.parse(time)
        });
        photo.save()
             .then(data => {
                User.findById(user_id)
                    .then(user => {
                        if(timeout[user_id])
                            clearTimeout(timeout[user_id]);
                        timeout[user_id] = setTimeout(() => sendAlert({user_id: user.name, id:user_id}), 30000);
                        return res.json(data)        
                    })
            })
            .catch(err => res.status(400).json({photo:"type error"}))
    } catch (err) {
        console.log(err);

        if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
            message: "File size cannot be larger than 2MB!",
        });
        }

        res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
}


const getUserHistory =(req, res) =>{     
    let result = [];
    Alert.find({})
    .then(async history => {
        for(let i = 0; i < history.length; i ++){
            let temp = {};
            temp.input_time = history[i].action_time;
            temp.type = history[i].type;
            await User.findById(history[i].user_id)
                .then(user_history => {
                    if(!user_history) {
                        temp.user_name = "Unsigned User";
                        temp.user_avatar = "default_avatar.png";
                    }
                    else{
                        temp.user_name = user_history.name;
                        temp.user_avatar = user_history.avatar;
                    }
                })
                .catch( err => console.log(err))
                result.push(temp);
        } 
        return res.json(result);
    })
}

module.exports = {
    GetPhotoData,
    ImageSave,
    getUserHistory
}