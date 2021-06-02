import axios from 'axios'
import NProgress from 'nprogress'
import Token from '@/utils/token'
import {refreshToken} from "@/api/login";
import store from '@/store';

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500 // 默认的
}
//创建axios实例
const service = axios.create({
    //axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: '/starts',
    //超时时间
    timeout: 30000
})

NProgress.configure({
    showSpinner: false
})

// 是否正在请求刷新token接口的标记
let isRefreshing = false;
// 请求队列
let requests = [];

//request拦截器
service.interceptors.request.use(
    config => {
        NProgress.start();
        let isAuthorization = config.headers['isAuthorization'];
        let token = getToken();
        if (!isAuthorization) {
            config.headers['Authorization'] = token;
        }
        //console.log('打印是否为刷新token：%s', config.headers.isRefresh);
        console.log("interceptors.request中拦截请求%s", config.url);
        return config
    },
    error => {
        console.log('request拦截异常请求：%s', JSON.stringify(error));
        Promise.reject(error)
    }
)

//response拦截器
service.interceptors.response.use(res => {
        let status = res.status;
        let config = res.config;
        console.log('http响应码：%s', status);
        console.log("interceptors.response中拦截请求%s", config.url);
        let data = res.data;
        let isRefresh = config.headers.isRefresh;
        if (isRefresh) {
            //当refreshtoken过期时，刷新token返回3015，需要重新登录
            if (data.code == 3015) {
                console.log('interceptors.response，refreshtoken过期了,跳转登录界面！');
                window.location.href = "/login";
            }
        } else {
            //当为非刷新token请求时，如果返回token过期，则尝试用refreshtoken刷新token
            if (data.code == 3014) {
                console.log('interceptors.response，token过期了，尝试刷新token');
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshToken().then(res => {
                        if (res.code == 1111) {
                            let data = res.data;
                            store.commit('setAccessToken', data);
                            isRefreshing = false;
                            //遍历缓存队列发起请求传入最新token
                            requests.forEach((request) => {
                                console.log('interceptors.response，释放请求：%s', JSON.stringify(request));
                                request(getToken());
                            });
                            //重试完清空这个队列
                            requests = [];
                            console.log('重新发起请求%s',JSON.stringify(config.url));
                            service(config);
                        } else {
                            isRefreshing = false;
                            requests = [];
                            store.commit('delAccessToken');
                            window.location.href = "/login";
                        }
                    }).catch(err => {
                        console.log('interceptors.response，刷新token返回异常%s', JSON.stringify(err));
                        isRefreshing = false;
                        requests = [];
                        store.commit('delAccessToken');
                        window.location.href = "/login";
                    })
                } else {
                    //判断是否正在刷新token
                    console.log('interceptors.response，添加%s到阻止requests列表', JSON.stringify(config));
                    return new Promise((resolve) => {
                        //将resolve放进队列，用一个函数形式来保存，等token刷新后调用执行
                        requests.push((token) => {
                            res.config.headers.Authorization = token;
                            resolve(service(config));
                        });
                    });
                }
            }
        }
        NProgress.done();
        return res.data;
    },
    error => {
        NProgress.done();
        console.log('response拦截异常返回：%s', JSON.stringify(error));
    }
)

function getToken() {
    let token = Token.getToken();
    if (token) {
        let hearder = token.token_type;
        return hearder.replace(hearder[0], hearder[0].toUpperCase()) + ' ' + token.access_token;
    }
    return;
}

export default service
