const express = require('express');
const router = express.Router();
const Controller = require('./../controller/auth.controller');
const passport  = require('passport');
//access private
//route /api/admin/addAdmin
router.post('/addAdmin',passport.authenticate('jwt', {session:false}), Controller.AddAdmin);
//access private
//route /api/admin/delAdmin
router.delete('/delAdmin/:id',passport.authenticate('jwt', {session:false}), Controller.DelAdmin);
//access private
//route /api/admin/editAdmin
router.put('/editAdmin',passport.authenticate('jwt', {session:false}), Controller.EditAdmin);
//access public
//route /api/admin/login
router.post('/login', Controller.LoginAdmin);

module.exports = router;