var express = require('express');
var router = express.Router();
var wechatConfig = require('./wechat.config.js');
const APPID = wechatConfig.APPID;
const SECRET = wechatConfig.SECRET;
const https = require('https');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
/* GET home page. */
router.get('/', function (req, res, next) {
    const code = req.query.code;
    getOpenId(code)
        .then(function(data){
            console.log(data);
            if(data&&data.errcode){
                res.json({success: false, error: data});
                res.end();
            }else{
                res.json({success: true, data: data.openid});
                res.end();
            }
        })
        .catch(function(err){
            console.log(err)
            res.json({success: false, error: err});
            res.end();
        });
});
function getOpenId(code){
    return new Promise(function(resolve,reject){
        var url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${SECRET}&code=${code}&grant_type=authorization_code`;
        console.log(url);
        https.get(url, (res) => {
            res.on('data', (data) => {
                data = JSON.parse(data);
                console.log('onresolev:',data);
                resolve(data);
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
};
module.exports = router;
