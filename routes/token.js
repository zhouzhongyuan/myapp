var express = require('express');
var router = express.Router();

var wechatConfig = require('./wechat.config.js');
const APPID = wechatConfig.APPID;
const SECRET = wechatConfig.SECRET;
const https = require('https');
var tokenData = {};
var firstOpen = true;
function getToken() {
    return new Promise(function (resolve, reject) {
        tokenData.status = 'pending';
        var token;
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${SECRET}`;
        https.get(url, (res) => {
            res.on('data', (data) => {
                data = JSON.parse(data);
                tokenData.data = data;
                tokenData.status = 'success';
                resolve(token);
            });
        }).on('error', (e) => {
            tokenData.status = 'error';
            tokenData.data = e;
            reject(e);
        });
    });
}

/* GET users listing. */
router.get('/', (req, res, next) => {
    if(firstOpen){
        getToken();
        var refreshToken = setInterval(getToken, 2 * 60 * 60 * 1000);
        firstOpen = false;
    }
    res.json(tokenData);
    res.end();
});

module.exports = router;

