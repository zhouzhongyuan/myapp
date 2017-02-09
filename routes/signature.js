var express = require('express');
var router = express.Router();
var sign = require('./sign.js');
var getTicket = require('./jsapiTicket').getTicket;
var jsapiTicket;
var Data = {};
function refreshTicket(){
    getTicket().then((data)=>{
        if(data.success){
            jsapiTicket = data.data.ticket;
        }
    })
}
refreshTicket();
setInterval(refreshTicket, 2 * 60 * 60 * 1000);
router.get('/', (req, res, next)=> {
    console.log(req.host );
    console.log(req.url);
    console.log(req.query.url)
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    fullUrl = 'http://jezhang.ngrok.cc';
    fullUrl = req.query.url;
    console.log(fullUrl);
    Data.data =  sign(jsapiTicket, fullUrl);
    Data.success = true;
    console.log(Data);
    res.json(Data);
    res.end();
});
module.exports = {
    router: router,
    data: Data
};
