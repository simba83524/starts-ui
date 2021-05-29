import request from '@/utils/request'

export function loadmenus(){
    return request({
        url:'/menu',
        method:'get'
    })
}
