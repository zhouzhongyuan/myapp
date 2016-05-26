var bpush = require('bpush-nodejs');
const cors = require('cors');
var express = require('express');
var router = express.Router();
var redis = require("redis"),
    client = redis.createClient();
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/proxy-server');
var pushDB  = require('../models/push');
router.post('/pushMsgToAll',function (req, res, next) {
    console.log(req.body);
    var data = {
        //channel_id: '3888302769921112822',
        msg: JSON.stringify(req.body.msg),
        msg_type: bpush.constant.MSG_TYPE.NOTIFICATION,
        deploy_status: bpush.constant.DEPLOY_STATUS.DEVELOPMENT,
        device_type: bpush.constant.DEVICE_TYPE.IOS
    };
    bpush.sendRequest(bpush.apis.pushMsgToAll, data)
        .then(function (data) {
            res.end('ok');
            data = JSON.parse(data);
            console.log(data);
        })
        .catch(function(e){
            console.error(e);
            res.end('error');
        });

});
module.exports = router;
