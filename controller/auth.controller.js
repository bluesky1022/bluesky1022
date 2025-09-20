const Admin = require('./../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('./../config/key').secretOrKey;

const AddAdmin = (req, res) => {
    let {id, name, password} = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt,  (err, hash) => {
            password = hash;
            const admin = new Admin({
                id, password, name
            });
            admin.save()
                .then(data => res.json(data))
                .catch(err => res.status(400).json(err));
        });
    });
}

const DelAdmin = (req, res) => {
    const admin_id = req.params.id;
    Admin.findOneAndDelete({id:admin_id})
        .then(() => res.json({delete:"success"}))
        .catch(err => res.status(400).json({delete: "failed"}))
}

const EditAdmin = async (req, res) => {
    const id = req.body.id;
    let {name, password} = req.body;
    if(name != null || password != null){
        Admin.findOne({id: id})
        .then(admin => {
            if(name) admin.name = name;
            if(password){
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        console.log(password);
                        password = hash;
                        console.log(password);
                        admin.password = password;
                        admin.save()
                            .then(admin => res.json(admin))
                            .catch(err => res.status(404).json({edit: "failed"}));
                    })
                })
            } else{
                admin.save()
                    .then(admin => res.json(admin))
                    .catch(err => res.status(404).json({edit: "failed"}));
            }
            
        })
        .catch(err => res.status(400).json({admin: "failed"}))
    }
}

const LoginAdmin = (req, res) => {
    const {id, password} = req.body;
    Admin.findOne({id: id})
        .then(admin => {
            if(!admin) 
                return res.status(404).json({admin:"Cannot find"});
            
            bcrypt.compare(password, admin.password)
                .then(isMatch => {
                    if(!isMatch)
                        return res.status(400).json({password:"Incorrect"})
                    const payload = {id:id, name:admin.name};
                    jwt.sign(
                        payload,
                        keys,
                        {expiresIn: 43200},
                        (err, token) => {
                            if(err)
                                throw err;
                            return res.json({
                                success:true,
                                token: 'Bearer ' + token
                            })
                        }
                    )
                })
        })
        .catch(err => res.status(400).json({login: "failed"}))
}

module.exports = {
    AddAdmin,
    DelAdmin,
    EditAdmin,
    LoginAdmin
}