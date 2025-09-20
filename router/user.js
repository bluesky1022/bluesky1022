const express = require('express');
const router = express.Router();
const Controller = require('./../controller/user.controller');
const passport = require('passport');

router.post('/login', Controller.LoginUser);
//access private
//route /api/user/addUser
router.post('/addUser',passport.authenticate('jwt', {session: false}), Controller.AddUser);
//access private
//route /api/user/delUser
router.delete('/delUser/:id',passport.authenticate('jwt', {session: false}), Controller.DelUser);
//access private
//route /api/user/editUser
router.put('/editUser',passport.authenticate('jwt', {session: false}), Controller.EditUser);
//access private
//route /api/user/getUsers
router.get('/getUsers',passport.authenticate('jwt', {session: false}), Controller.GetUsers);
//access private
//route /api/user/getUserByGroupName
router.get('/getUserByGroupName/:name', passport.authenticate('jwt', {session: false}), Controller.GetUserByGroupName)
//access private
//route /api/user/resetUserpassword
router.post('/resetUserpassword',passport.authenticate('jwt', {session: false}), Controller.ResetUserpassword);
//access private
//route /api/user/getGroups
router.get('/getGroups', passport.authenticate('jwt', {session: false}), Controller.GetGroups);
//access private
//route /api/user/addGroup
router.post('/addGroup', passport.authenticate('jwt', {session: false}), Controller.AddGroup);
//access private
//route /api/user/editGroup
router.put('/editGroup', passport.authenticate('jwt', {session: false}), Controller.EditGroup);

//access private
//route /api/user/editGroup
router.get('/getlogindata', passport.authenticate('jwt', {session: false}), Controller.getLoginData);
//access private
//route /api/user/delGroup
router.delete('/delGroup/:id',passport.authenticate('jwt', {session: false}), Controller.DelGroup);
//access private
//route /api/user/uploadAvatar
router.post('/uploadAvatar', passport.authenticate('jwt', {session: false}), Controller.UploadAvatar);
//access private
//route /api/user/uploadBrand
router.post('/uploadBrand',passport.authenticate('jwt', {session: false}), Controller.UploadBrand);

module.exports = router;