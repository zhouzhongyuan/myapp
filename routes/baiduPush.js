var bpush = require('bpush-nodejs');
const cors = require('cors');
var express = require('express');
var router = express.Router();
var redis = require("redis"),
    client = redis.createClient();
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/proxy-server');
var pushDB  = require('../models/push');
var push = new pushDB();
router.post('/pushMsgToAll',function (req, res, next) {
    console.log(req.body);
    var data = {
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
router.post('/pushMsgToSingleDevice',function(req, res, next){
    msg:JSON.stringify(req.body),
        bpush.sendRequest(bpush.apis.pushMsgToSingleDevice, data).then(function (data) {
            res.end(data);
            data = JSON.parse(data);
            console.log(data);
        }).catch(function(e){
            console.error(e);
        });
});
router.post('/pushMsgToUser',function(req, res, next){
    pushDB.find({ user: req.body.user }, function(err, dbdata) {
        if(err){
            console.log(err);
            res.end(err);
        }
        if(dbdata.length==0){
            console.log('no task');
            res.end('no binded devices');
        }
        console.log(dbdata);
        //TODO pushMsgToSingleDevice 2 batch_device,现在只能发送一个。
        var data = {
            channel_id: dbdata[1].channelId,
            msg: JSON.stringify(req.body.msg),
            msg_type: bpush.constant.MSG_TYPE.NOTIFICATION,
            deploy_status: bpush.constant.DEPLOY_STATUS.DEVELOPMENT,
            device_type: bpush.constant.DEVICE_TYPE.IOS
        };
        bpush.sendRequest(bpush.apis.pushMsgToSingleDevice, data).then(function (data) {
            res.end(data);
            data = JSON.parse(data);
            console.log(data);
        }).catch(function(e){
            console.error(e);
        });
    })
});
router.post('/bindUser',function(req, res, next){
    push.user = req.body.user;
    push.channelId = req.body.channelId;
    //查看是否有此设备ID,有 更新,否 insert
    pushDB.find({ channelId: req.body.channelId }, function(err, data) {
        console.log(data)
        if(data.length==0){
            console.log('no task');
            push.save(function (err) {
                if (err) {
                    this.body = err;
                }
                res.json(req.body);
                res.end();
            });
        }else{
            console.log(req.body.channelId,push.user);
            pushDB.update({channelId: req.body.channelId},{$set:{user:req.body.user}},function(err,data){
                if (err) {
                    console.log(err);
                    this.body = err;
                }
                console.log(data)
                res.json(req.body);
                res.end();
            })
        }
    })

});
router.get('/bindUser',function(req, res, next){
    pushDB.find({},function(err, data) {
        if(err){
            console.log(err);
        }
        if(data.length==0){
            console.log('no user');
        }
        res.json(data);
        res.end();
    })
});
module.exports = router;


//SUMSUNG 3888302769921112822
//MI 3614459978666263871