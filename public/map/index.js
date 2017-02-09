requirejs(["../jweixin-1.0.0.js"], function(wx) {
    const appId = 'wx739b9f74ab475e99';
    //添加参数url
    let currentUrl = window.location.href;
    currentUrl = currentUrl.split('#')[0];
    console.log(currentUrl);
    fetch(`/signature?url=${currentUrl}`)
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (response) {
            console.log(response);
            let sign = response.data;
            console.log('sign: ',sign);
            wx.config({
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId, // 必填，公众号的唯一标识
                timestamp: sign.timestamp, // 必填，生成签名的时间戳
                nonceStr: sign.nonceStr, // 必填，生成签名的随机串
                signature: sign.signature, // 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addard', 'chooseCard', 'openCard'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        })
        .then(function (text) {
            wx.ready(function () {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            });
        });




    var getLocation = document.getElementById('getLocation');
    getLocation.addEventListener('click', (e) => {
        wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                console.log(latitude,longitude);

                wx.openLocation({
                    latitude,
                    longitude,
                    name: '上海博科', // 位置名
                    address: '什么详情，我不知道', // 地址详情说明
                    scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: 'http://bokesoft.com' // 在查看位置界面底部显示的超链接,可点击跳转
                });

            }
        });
    })
});