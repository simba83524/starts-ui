const local = window.sessionStorage;

export default {
    setToken(token) {
        token.expired_time = token.expires_in*1000 + Date.now();
        local.setItem('starts_token', JSON.stringify(token));
    },
    getToken() {
        let token = local.getItem('starts_token');
        if(token){
            return JSON.parse(token);
        }
    },
    delToken() {
        local.removeItem('starts_token');
    },
    setClient(client){
        local.setItem('starts_client',JSON.stringify(client));
    },
    getClient(){
        let client = local.getItem('starts_client');
        if(client){
            return JSON.parse(client);
        }
    },
    delClient(){
        local.removeItem('starts_client');
    }

}
