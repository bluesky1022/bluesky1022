const express = require('express');
const router = express.Router();
const auth = require('./auth');
const user = require('./user');
const tracking = require('./tracking');
const monitor = require('./monitor');
const viewscreen = require('./viewscreen');

router.use('/auth', auth);
router.use('/user', user);
router.use('/tracking', tracking);
router.use('/monitor', monitor);
router.use('/viewscreen', viewscreen);

module.exports = router;