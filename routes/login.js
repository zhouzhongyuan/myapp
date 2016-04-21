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
//var NodeRSA = require('node-rsa');
var NodeRSA = require('../libs/rsa.js');
//var Base64 = require('js-base64').Base64;


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
router.get('/', (req, res, next) => {
    //1.1处理input
    const user = req.query.user;
    const pwd = req.query.pwd;
    //1.2向yigo获取加密的密码



});
//getPublicKey();

module.exports = router;

function getPublicKey(){
    return new Promise(function (resolve, reject) {
        const data ={"url":"http://1.1.8.67:8089/yigo/servlet","clientID":"","isWeb":true,"service":"GetPublicKey","async":false,"mode":1,"locale":"en-US","timezone":"Asia/Shanghai"};
        const url = 'http://1.1.8.67:8089/yigo/servlet';
        request.post({url:url, form:data},function(err, response, body){
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
    console.log(user,pwd);
    return new Promise(function(resolve,reject){
        "use strict";
        const data = {
            "url":"http://1.1.8.67:8089/yigo/servlet",
            "clientID":"",
            "user":user,
            "password":pwd,
            "cmd":"Login",
            "service":"Authenticate",
            "mode":1,
            "locale":"en-US"};
        const url = 'http://1.1.8.67:8089/yigo/servlet';
        request.post({url:url, form:data},function(err, response, body){
            if(err){
                console.log(err);
                reject(err);
            }
            if (!err && response.statusCode == 200) {
                //var body = JSON.parse(body);
                console.log(body);
                resolve(body);
            }else{
                console.log(body);
                resolve(body);
            }
        })
    });
}
function pwdEncrypt(pwd,publicKey){
    var rsa = new NodeRSA();
    rsa.setPublic(publicKey.modulus, publicKey.exponent);
    pwd = rsa.encrypt(pwd);

    var Base64 = require('js-base64').Base64;
    //var Base64 = new Base64();
    pwd = Base64.encode(pwd);
    console.log(pwd);
    return pwd;
}
var start = async (function () {
    const user = 'admin';
    var pwd = '';
    // 在这里使用起来就像同步代码那样直观
    console.log('start');
    var publicKey = await (getPublicKey());
    var pwd = await (pwdEncrypt(pwd,publicKey));
    var authInfo = await(auth(user,pwd));
    console.log(authInfo);
    console.log('end');
});

start();