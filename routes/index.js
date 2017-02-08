var express = require('express');
var router = express.Router();
const http = require('http'),
    https = require('https'),
    url = require('url'),
    crypto = require('crypto');

/* GET home page. */
router.get('/', function (req, res, next) {
    var query = require('url').parse(req.url, true).query,
        token = 'mytest',
        array = [token, query.timestamp, query.nonce],
        key = array.sort().join(''),
        sha1 = crypto.createHash('sha1').update(key).digest('hex');
    // sha1 处理结束

    if (sha1 == query.signature) {
        console.log(sha1, query)
        console.log(query.echostr);
        res.end(query.echostr); // 返回 echostr 实现验证
    } else {
        console.log(query);
        res.end('error get server');
    }

});
router.post('/', function (req, res, next) {
    console.log('route  / post');
    // res.writeHead(200, {'Content-Type': 'application/xml'});

    var data = req.body.xml;
    var resMsg = '<xml>' +
        '<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
        '<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
        '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
        '<MsgType><![CDATA[text]]></MsgType>' +
        '<Content><![CDATA['+data.content+']]></Content>' +
        '</xml>';
    console.log(resMsg);

    if(data.content.match(/黄图/)){
        console.log('黄图')
        let media_id = 'z36yLDpsYmZLgF8SEFDgrL9GXdl3ZRR_4tHLcibosGYD7AE3c7EXLIgY7K9-Jtym';

        var resMsg = '<xml>' +
            '<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
            '<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
            '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
            '<MsgType><![CDATA[image]]></MsgType>' +
            '<Image>' +
            '   <MediaId><![CDATA['+media_id+']]></MediaId>' +
            '</Image>' +
            '</xml>';
    } else  if(data.content.match(/视频/)){
        let media_id = 'xOmvljHGmtue37scDoNXCMHi4GGOW8_HrLAXf1D9juEClsbKDplYacde2zh_ZCMY';

        var resMsg = '<xml>' +
            '<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
            '<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
            '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
            '<MsgType><![CDATA[video]]></MsgType>' +
            '<Video>'+
            '<MediaId><![CDATA['+media_id+']]></MediaId>'+
            '<Title><![CDATA[Goolge Drive Intro]]></Title>'+
            '<Description><![CDATA[360p]]></Description>'+
            '</Video>'+
            '</xml>';
    }
    res.end(resMsg);
});







module.exports = router;
