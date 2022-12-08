import axios from 'axios';
// 创建一个自定义的Axios对象
const Axios = axios.create({
    baseURL: 'http://localhost:8081',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'lm-token': localStorage.getItem("token")
    },
    withCredentials: true
});

Axios.interceptors.request.use(req => {
    // 请求拦截处理
    // console.log('这里是请求拦截器，我拦截了请求', req);
    const token = req.headers.get("lm-token")
    if (token !== undefined )
        return req;
}, err => {
    console.log('在发送请求时发生错误，错误为', err);
    //这里不能直接放回err,需要按照官方说明返回一个Promise
    return Promise.reject(err);
})

Axios.interceptors.response.use(response => {
    // 响应拦截处理
    let res = response.data;
    // 如果是返回的文件
    if (response.config.responseType === 'blob') {
        return res
    }
    // 兼容服务端返回的字符串数据
    if (typeof res == 'string') {
        res = res ? JSON.parse(res) : res
    }
    return res;
}, error => {
    const err = error.toString();
    //按照实际的响应包进行解析，通过关键字匹配的方式
    switch (true) {
        case err.indexOf('Network') !== -1:
            console.log('后端服务器无响应或者URL错误', err);
            break;
        case err.indexOf('timeout') !== -1:
            console.log('请求后端服务器超时！', err);
            break;
    }
    return Promise.reject(error);
})

//暴露Axios实例化对象，允许所有文件调用Axios
export default Axios;