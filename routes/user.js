var express = require('express');
var router = express.Router();
var redis = require("redis"),
    client = redis.createClient();
/* GET home page. */
router.get('/', function (req, res, next) {
    client.keys("*", function (err, obj) {
        obj = obj.toString();
        res.end(obj);
    });

});
module.exports = router;
