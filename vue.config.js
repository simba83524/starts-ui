const port = 8081;

let proxyObj = {}

proxyObj['/'] = {
    //websocket
    ws: false,
    //目标地址
    target:'http://localhost:9000',
    //发送请求头会被设置为target
    changeOrigin: true,
    //不重写请求地址
    pathRewrite:{
        '^/': '/'
    }


}

module.exports={
    devServer:{
        host:'localhost',
        port:port,
        proxy:proxyObj
    }
}
