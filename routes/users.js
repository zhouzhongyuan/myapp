var express = require('express');
var router = express.Router();
var tokenData={};
const APPID = 'wx739b9f74ab475e99';
const SECRET = '87fd54b03415de53dffef7d3a9368fc';
const https = require('https');
function getToken(){
  return new Promise(function(resolve,reject){
    var token;
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${SECRET}`;
    var req = https.get(url,(res) => {
      res.on('data', (data) => {
        data = JSON.parse(data);
        token = data;
        resolve(token);
      });
    }).on('error', (e) => {
      reject(e);
    });;
  });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  getToken().then(function(d){
    tokenData.data = d;
    tokenData.status = 'success';
    console.log(tokenData);
  }).catch(function(e){
    tokenData.status = 'error';
    console.log(e)
  });
  res.json(tokenData);
  res.end();
});

module.exports = router;

