var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
    "use strict";
    res.end('ok');
});
router.post('/', function (req, res, next) {
    "use strict";
    console.log(req.body);
    var xml = ' <xml>\
        <ToUserName><![CDATA[toUser]]></ToUserName>\
        <FromUserName><![CDATA[fromUser]]></FromUserName>\
        <CreateTime>1348831860</CreateTime>\
        <MsgType><![CDATA[text]]></MsgType>\
        <Content><![CDATA[this is a test]]></Content>\
    <MsgId>1234567890123456</MsgId>\
    </xml>'
    res.end(xml);
});
module.exports = router;
