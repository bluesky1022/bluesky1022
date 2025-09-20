const express = require('express');
const router = express.Router();
const Controller = require('./../controller/tracking.controller');
const passport = require('passport');

//access private
//route /api/tracking/photoData
router.post('/photoData',passport.authenticate('jwt', {session:false}), Controller.GetPhotoData);
//access private
//route /api/tracking/imgSave
router.post('/imgSave',passport.authenticate('jwt', {session:false}), Controller.ImageSave);
//access private
//route /api/tracking/getuserhistory
router.get('/getuserhistory',passport.authenticate('jwt', {session:false}), Controller.getUserHistory);

module.exports = router;