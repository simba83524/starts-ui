import service from "@/utils/request";
import { Base64 } from 'js-base64';
import Token from "@/utils/token";

export function login(client, params) {
    let Basic_auth = 'Basic '+Base64.encode(client.client_id+':'+client.client_scret);
    return service({
        url: '/oauth/token',
        headers: {
            isLogin:true,
            isAuthorization:true,
            'Authorization': Basic_auth
        },
        method: 'post',
        params: params
    })
}

export function refreshToken() {
    let client = Token.getClient();
    let refresh_token = Token.getToken().refresh_token;
    let params = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
    }
    let Basic_auth = 'Basic '+Base64.encode(client.client_id+':'+client.client_scret);
    return service({
        url: '/oauth/token',
        headers: {
            isRefresh:true,
            isAuthorization:true,
            'Authorization': Basic_auth
        },
        method: 'post',
        params: params
    })
}
