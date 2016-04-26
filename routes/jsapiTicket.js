var express = require('express');
var router = express.Router();
const https = require('https');
var jsapiTicket = {};
jsapiTicket.status = 'pending';
var getToken = require('./token').getToken;
var ACCESS_TOKEN;
function getTicket(){
    return new Promise(function(resolve,reject){
        getToken()
            .then(function(data){
                if(data.success){
                    ACCESS_TOKEN = data.data.access_token;
                    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${ACCESS_TOKEN}&type=jsapi`;
                    https.get(url, (res) => {
                        res.on('data', (data) => {
                            data = JSON.parse(data);
                            jsapiTicket.data = data;
                            jsapiTicket.status = 'success';
                            jsapiTicket.success = jsapiTicket.data.ticket?true:false;
                            //console.log('ticket',jsapiTicket);
                            resolve(jsapiTicket);
                        });
                    }).on('error', (e) => {
                        jsapiTicket.status = 'error';
                        jsapiTicket.data = e;
                        reject(jsapiTicket);
                    });
                }
            });
    });

}
getTicket();
setInterval(getTicket, 2 * 60 * 60 * 1000);
module.exports =  {
    router: router,
    data: jsapiTicket,
    getTicket:getTicket
};

