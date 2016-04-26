var express = require('express');
var router = express.Router();

var wechatConfig = require('./wechat.config.js');
const APPID = wechatConfig.APPID;
const SECRET = wechatConfig.SECRET;
const https = require('https');
var tokenData = {};
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
                tokenData.success = tokenData.data.access_token?true:false;
                resolve(tokenData);
            });
        }).on('error', (e) => {
            tokenData.status = 'error';
            tokenData.data = e;
            reject(e);
        });
    });
}
//getToken();
setInterval(getToken, 2 * 60 * 60 * 1000);

module.exports = {
    tokenData: tokenData,
    getToken:getToken
};

