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
    fullUrl = req.query.url;
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
