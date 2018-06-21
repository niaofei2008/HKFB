import _fetch from '../_fetch'
import { _baseRongYun } from '../_baseRequest'
let RongYun = {}

RongYun.getToken = function (userId, userName, portraitUri) {
    let url = HOST_RONGYUN + 'iData.aspx'
    let params = new Map();
    let flag = 'GetToken';
    params.set('flag', flag)
    params.set('userId', userId);
    params.set('portraitUri', portraitUri);
    console.log('获取融云',params)
    return _baseRongYun(url, params);
}
export default RongYun;