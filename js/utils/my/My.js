import _fetch from '../_fetch'
import { _baseRequest_url, _baseRequest_form } from '../_baseRequest'
let My = {}

My.signStatus = function (keyword = '') {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'qianDaoList';
    params.set('flag', flag)
    params.set('keyword', keyword);
    return _baseRequest_url(url, params);
}

My.editPhone = function (uIdx, newPhone) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'editPhone';
    params.set('flag', flag)
    params.set('uIdx', uIdx);
    params.set('newPhone', newPhone);
    return _baseRequest_url(url, params);
}
My.editPassword = function (uIdx, oldPassword, newPassword) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'editPassword';
    params.set('flag', flag)
    params.set('uIdx', uIdx);
    params.set('oldPassword', oldPassword);
    params.set('newPassword', newPassword);
    return _baseRequest_url(url, params);
}
My.uploadAvatar = function (obj) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'editImgHeader';
    params.set('flag', flag)
    for (let i = 0; i < Object.keys(obj).length; i++) {
        params.set(Object.keys(obj)[i], Object.values(obj)[i]);
    }
    console.log(params)
    return _baseRequest_form(url, params);
}
My.suggestion = function (txtContent, userIdx) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'clientMessage';
    params.set('flag', flag)
    params.set('txtContent', txtContent);
    params.set('userIdx', userIdx);
    return _baseRequest_url(url, params);
}
My.message = function (uIdx) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'APPMessageList';
    params.set('flag', flag)
    params.set('uIdx', uIdx);
    return _baseRequest_url(url, params);
}
export default My;