var express = require('express');
var router = express.Router();
var wechatConfig = require('./wechat.config.js');
const APPID = wechatConfig.APPID;
const SECRET = wechatConfig.SECRET;
var https = require('https');
var http = require('http');
var request = require('request');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var NodeRSA = require('../libs/rsa.js');
var Base64 = require('js-base64').Base64;
var redis = require("redis"),
    client = redis.createClient();
const URL = wechatConfig.SERVER_PATH;
/*
* 代理登录
* input: user pwd
* output: 数据库中有对应关系, {status}
* 实现:  1.处理input,
*       2.向yigo服务器验证;
*       3.结果处理(sql,页面)
* 问题:1.绑定openID和yigo user 之后,用户可能会修改密码
*     2.sql server尽量不使用mongo,简直大炮打蚊子,需要找个sql server.
* */
/* GET users listing. */
router.get('/tryLogin', async((req, res, next) => {
    console.log('try logi uri ',req.url);
    var openId = req.query.openid;
    //search redis
    client.hgetall(openId, async(function (err, obj) {
        console.log(' trylogin openid:',obj)
        if(err!==null || obj === null){
            console.log(err,obj);
            res.json({success:false,error:'no this openId'});
            res.end();
        }else {
            var logInfo = await(getLogInfo(obj.user,obj.pwd));
            res.json(logInfo);
            console.log(logInfo);
            res.end();
        }
    }));
}));
router.get('/login', async((req, res, next) => {
    console.log('login url',req.url);
    const user = req.query.user;
    const pwd = req.query.pwd;
    const openId = req.query.openid;
    console.log('login pwd & openid ',pwd,openId);
    var logInfo = await(getLogInfo(user,pwd));
    //保存到数据库
    if(logInfo.success){
        console.log('login openid',openId);
        if(openId){
            saveData(user,openId,pwd);
        }
    }
    res.json(logInfo);
    res.end();
}));
//getPublicKey();
module.exports = router;
function getPublicKey(){
    return new Promise(function (resolve, reject) {
        const data ={"url":URL,"clientID":"","isWeb":true,"service":"GetPublicKey","async":false,"mode":1,"locale":"en-US","timezone":"Asia/Shanghai"};
        request.post({url:URL, form:data},function(err, response, body){
            if(err){
                reject(err);
            }
            if (!err && response.statusCode == 200) {
                var body = JSON.parse(body);
                if(body.data){
                    resolve(body.data);
                }
            }
        })
    })
}
function auth(user,pwd){
    return new Promise(function(resolve,reject){
        "use strict";
        const data = {
            "url":URL,
            "clientID":"",
            "user":user,
            "password":pwd,
            "cmd":"Login",
            "service":"Authenticate",
            "mode":1,
            "locale":"en-US"};
        request.post({url:URL, form:data},function(err, response, body){
            if(err){
                reject(err);
            }
            if (!err) {
                resolve(body);
            }
        })
    });
}
function pwdEncrypt(pwd,publicKey){
    var rsa = new NodeRSA();
    rsa.setPublic(publicKey.modulus, publicKey.exponent);
    pwd = rsa.encrypt(pwd);
    pwd = Base64.encode(pwd);
    return pwd;
}
var getLogInfo = async (function (user,pwd) {
    var publicKey = await (getPublicKey());
    var pwd = await (pwdEncrypt(pwd,publicKey));
    var authInfo = await(auth(user,pwd));
    //包装一下数据
    authInfo = JSON.parse(authInfo);
    if(authInfo.data){
        authInfo.success = true;
    }
    return authInfo;
});
function saveData(user,openId,pwd){
    //保存到数据库
    client.HMSET(openId, {
        "user": user, // NOTE: key and value will be coerced to strings
        "pwd": pwd
    },redis.print);
};
