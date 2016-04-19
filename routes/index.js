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

module.exports = router;
