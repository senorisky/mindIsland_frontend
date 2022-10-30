import http from './http.js'

// 验证用户名\密码，这里指的是使用POST方法请求Login接口，并携带params对象作为参数。
export function loginBoot(params) {
    return http.post("/login", params)
}

export function getNotes(params) {
    return http.post("/", params)
}