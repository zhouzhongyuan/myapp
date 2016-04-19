var express = require('express');
var wechatConfig = require('./wechat.config.js');
const APPID = wechatConfig.APPID;
const SECRET = wechatConfig.SECRET;
var router = express.Router();
const http = require('http'),
    https = require('https'),
    url = require('url'),
    crypto = require('crypto');

/* GET users listing. */
router.get('/', function (req, res, next) {
    const code = req.query.code;
    if(code){
        getToken(code)
            .then(function(data){
                return getInfo(data);
            })
            .then(function(data){
                console.log(`${data}`)
                console.log('begin to send json',data);
                res.json(data);
                res.end();
            });
    }else{
        res.render('users', {title: '获取CODE',code:code});
        res.end();
    }
});

module.exports = router;
function getToken(code){
    return new Promise(function(resolve,reject){
        https.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${SECRET}&code=${code}&grant_type=authorization_code`, (res) => {
            res.on('data', (data) => {
                data = JSON.parse(data);
                resolve(data);
            });

        }).on('error', (e) => {
            reject(e);
        });
    });

};

function getInfo(data){
    return new Promise(function(resolve,reject){
        const access_token = data.access_token;
        const openid = data.openid;
        const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
        console.log(`step 4: ${url}`);
        https.get(url, (res) => {
            res.on('data', (data) => {
                var data = JSON.parse(data);
                resolve(data);
            });

        }).on('error', (e) => {
            reject(e);
        });
    });
};
