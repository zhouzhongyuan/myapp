var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    const code = req.query.code;
    res.render('users', {title: '获取CODE',code:code});
    //获取access_token
    //ID
    res.end();
});

module.exports = router;
