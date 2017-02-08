# Wechat中转服务器 && BaiduPush中转服务器

## Wechat中转服务器

### 配置需求

APPID

SECRET

### api

#### 自定义菜单

````
{
     "button":[
     {	
          "type": "view", 
          "name": "芝麻开门", 
          "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx739b9f74ab475e99redirect_uri=http%3A%2F%2F192.168.1.116%2F%23%2Fhome%2FReceiptViewresponse_type=codescope=snsapi_userinfostate=STATEconnect_redirect=1#wechat_redirect", 

      },
      {
           "name":"菜单",
           "sub_button":[
           {	
               "type":"view",
               "name":"搜索",
               "url":"http://www.soso.com/"
            },
            {
               "type":"click",
               "name":"赞一下我们",
               "key":"V1001_GOOD"
            }]
       }]
 }
```



## BaiduPush中转服务器

### 要求

1. redis-server


## run

```
npm install
```

redis