const User = require('./../models/User');
const Group = require('./../models/Group');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
let fs = require('fs');
const Photo = require('../models/Photo');
const keys = require('./../config/key').secretOrKey;
const uploadFile = require("../config/middleware").uploadFileMiddleware;
const uploadFile_brand = require("../config/middleware").uploadFileMiddleware_brand;
let basedir_avatar = __basedir + "\\avatars\\";
let basedir_brand = __basedir + "\\brands\\";

const LoginUser = (req, res) => {
    const {id, password} = req.body;
    User.findOne({id: id})
        .then(user => {
            if(!user)
                return res.status(404).json({user:"Cannot find"});
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch)
                        return res.status(400).json({password:"Incorrect"})
                    const alert = new Alert({
                        user_id: id,
                        type:true,
                        action_time: Date.parse(new Date())
                    })
                    alert.save()
                        .then(res => res.json({success:true}));
                }).catch(err => res.status(400).json(err))
        })
        .catch(err => res.status(400).json(err))
}

const AddUser = (req, res) => {
    let {id, name, avatar, group_id} = req.body;
    let password = "123456"
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt,  (err, hash) => {
            password = hash;
            const user = new User({
                id, name, avatar, password, group_id
            });
            user.save()
                .then(data => res.json(data))
                .catch(err => res.status(400).json(err));
        });
    });
}

const DelUser = (req, res) => {
    const user_id = req.params.id;
    User.findOneAndDelete({id: user_id})
        .then((user) => {
            if(!user) return res.status(400).json({deluser: 'failed'});
            if(user.avatar){
                fs.unlink(basedir_avatar + user.avatar, (err) => {
                    console.log(err);
                });
            }
            res.json({success:true})
        })
        .catch(err => res.status(404).json(err));
}

const EditUser = (req, res) => {
    let {id, name, avatar, group_id} = req.body;
    
    if(id != null && (name != null || avatar != null || group_id != null)){
        User.findOne({id: id})
            .then(user => {
                if(!user) return res.status(404).json({edit: "failed"})
                if(name) user.name = name;
                if(avatar) user.avatar = avatar;
                if(group_id || (!group_id && user.group_id)){
                    if(group_id){
                        Group.findOne({name: group_id})
                        .then(group => {
                            if(!group) res.status(404).json({group: "no group"});
                            else{
                                group_id = group._id;
                                user.group_id = group_id;
                                user.save()
                                    .then(user => res.json(user))
                                    .catch(err => res.status(404).json(err));
                            }
                        }).catch(err => res.status(400).json(err))
                    } else{
                        user.group_id = group_id;
                        user.save()
                            .then(user => res.json(user))
                            .catch(err => res.status(404).json(err));
                    }
                } else{
                    user.save()
                        .then(user => res.json(user))
                        .catch(err => res.status(404).json({edit: "failed"}));
                }
                
            })
            .catch(err => res.status(400).json({edit: "failed"}))
    }
}

const ResetUserpassword = (req, res) => {
    let { id, password } = req.body;
    User.findOne({id: id})
        .then(user => {
            if(!user) return res.status(400).json({user: "no user"})
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    user.password = hash;
                    user.save()
                        .then(user => res.json(user))
                        .catch(err => res.status(404).json({edit: "failed"}));
                })
        })
    })
    .catch(err => res.status(400).json({editpassword: "failed"}))
    
}

const GetUsers = (req, res) => {
    User.find({})
        .then(users => {
            return res.json(users);
        })
}

const GetUserByGroupName = (req, res) => {
    console.log(req.params.name)
    Group.findOne({name:req.params.name})
        .then(group => {
            User.find({group_id: group._id})
                .then(users => res.json(users))
        })
        .catch(err => res.status(400).json({getuser: "failed"}))
}

const GetGroups = (req, res) => {
    Group.find({})
        .then(group => {
            return res.json(group);
        })
        .catch(err => res.status(400).json({getgroup: "failed"}))
}

const AddGroup = (req, res) => {
    let {name, time_interval, brand} = req.body;
    let newGroup = new Group({
        name: name,
        time_interval: time_interval,
        brand: brand
    });
    
    newGroup.save()
        .then((group) => res.json(group))
        .catch((err) => res.status(400).json({save: "failed"}))
}

const EditGroup = (req, res) => {
    let {name, time_interval, brand} = req.body;
    
    if(name != null && (time_interval != null || brand != null)){
        Group.findOne({name: name})
            .then(group => {
                if(!group) res.status(404).json({group: "no group"});
                if(time_interval)group.time_interval = time_interval;
                if(brand) group.brand = brand;
                group.save()
                    .then(group => res.json(group))
                    .catch(err => res.status(400).json({group: "failed edit group"}));
            })
            .catch(err => res.status(400).json({editgroup: "failed"}))
    }
}

const DelGroup = (req, res) => {
    const groups_id = req.params.id;
    console.log("delGroup: ", groups_id)
    Group.findOneAndDelete({"name": groups_id})
        .then((group) => {
            if(!group) return res.status(400).json({delgroup: 'failed'});
            if(group.brand){
                fs.unlink(basedir_brand + group.brand, (err) => {
                    console.log("file not found.", err);
                });
            }
            res.json({success:true})
        })
        .catch(err => res.status(404).json(err));
}

const UploadAvatar = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
        }

        res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
        });
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

const UploadBrand = async (req, res) => {
    try {
        await uploadFile_brand(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
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

// const SetGroup = (req, res) => {
//     const {id, group_id} = req.body;
//     User.findOne({id})
//         .then((user) => {
//             if(!user)
//                 res.status(404).json({user: "there is no user"});
//             Group.findById(group_id)
//                 .then(group => {
//                     if(!group)
//                         res.status(404).json({group: "invalid group_id"});
//                     user.group_id = group_id;
//                     user.save()
//                         .then(user => res.json(user))
//                         .catch(err => res.status(400).json({user: "set group faild"}))
//                 })
//         })
// }

// const SetInterval = (req, res) => {
//     const name = req.body.name;
//     Group.findOne({name:name})
//         .then(group => {
//             if(!group)
//                 return res.status(404).json({group:"not found"});
//             group.time_interval = req.body.time_interval;
//             group.save()
//                 .then(() => {
//                     return res.json({success:true})
//                 })
//                 .catch(err => res.status(400).json({err: "Format invalid"}))
//         })
// }


const getLoginData = (req, res) => {
    let result = [];
    User.find({})
        .then(async users => {
            for(let i = 0 ; i < users.length ; i ++){
                let temp = {};
                temp.userdata = users[i];
               
                await Photo.find({user_id: users[i]._id})
                            .sort({recv_time: -1})
                            .then(data => {
                                if(data.length > 0) 
                                    temp.time = data[0];
                                else temp.time = 0;
                            });
                await  Group.findById(users[i].group_id)
                    .then( usergroup => {                  
                           temp.usergroup = usergroup;
                           if(usergroup == null){
                            temp.usergroup = {
                                time_interval: 100,
                                brand:"default_brand.jpg"
                            }
                           }
                    });
                result.push(temp);
                
                
            }
            return res.json(result);
        })
        .catch(err => res.status(400).json({getLoginData: "failed"}))  
    
}


module.exports = {
    AddUser,
    DelUser,
    EditUser,
    GetUsers,
    // SetGroup,
    GetGroups,
    AddGroup,
    EditGroup,
    DelGroup,
    UploadAvatar,
    UploadBrand,
    // SetInterval
    ResetUserpassword,
    getLoginData,
    GetUserByGroupName,
    LoginUser
};