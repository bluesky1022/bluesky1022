const express = require('express');
const router = express.Router();
const Controller = require('./../controller/viewscreen.controller');
const passport = require('passport');

//access private
//route /api/viewscreen/getScreen/:id
router.get('/getScreen/:id',passport.authenticate('jwt', {session:false}), Controller.GetScreen);
//access private
//route /api/viewscreen/image/:imageName
//desc <img src="http://localhost:5000/api/viewscreen/image/capture"> for photos/capture.png
router.get('/image/:imageName', Controller.GetImage);
//access private
//route /api/viewscreen/avatar/:imageName
//desc <img src="http://localhost:5000/api/viewscreen/avatar/john.png"> for photos/capture.png
router.get('/avatar/:imageName', Controller.GetAvatar);
//access private
//route /api/viewscreen/brand/:imageName
//desc <img src="http://localhost:5000/api/viewscreen/avatar/john.png"> for photos/capture.png
router.get('/brand/:imageName', Controller.GetBrnad);

module.exports = router;