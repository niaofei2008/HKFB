import _fetch from '../_fetch'
import { _baseRequest_url } from '../_baseRequest'
let Login = {}

Login.login = function (uName, uPwd) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'login';
    params.set('flag', flag)
    params.set('uName', uName);
    params.set('uPwd', uPwd);
    return _baseRequest_url(url, params);
}

export default Login;