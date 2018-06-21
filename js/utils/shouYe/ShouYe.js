import _fetch from '../_fetch'
import { _baseRequest_url } from '../_baseRequest'
let ShouYe = {}

ShouYe.midBanner = function () {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'currentProjectInfo';
    params.set('flag', flag)
    return _baseRequest_url(url, params);
}
ShouYe.sign = function (idx, longitude, latitude) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'qianDaoShangBan';
    params.set('flag', flag)
    params.set('uIdx', idx)
    params.set('gpsX', longitude)
    params.set('gpsY', latitude)
    return _baseRequest_url(url, params);
}
ShouYe.signEndWork = function (idx, longitude, latitude) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'qianDaoXiaBan';
    params.set('flag', flag)
    params.set('uIdx', idx)
    params.set('gprsX', longitude)
    params.set('gprsY', latitude)
    return _baseRequest_url(url, params);
}
ShouYe.policeCondition = function (idx) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'projectDetailList&';
    params.set('flag', flag)
    params.set('uIdx', idx)
    return _baseRequest_url(url, params)
}
ShouYe.policeShow = function (currentIdx, unitIdx) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'projectUserShow';
    params.set('flag', flag)
    params.set('currentIdx', currentIdx);
    params.set('unitIdx', unitIdx);
    return _baseRequest_url(url, params)
}
ShouYe.anBaoShow = function (currentIdx) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'SecurityUserShow';
    params.set('flag', flag)
    params.set('currentIdx', currentIdx);
    return _baseRequest_url(url, params)
}
ShouYe.policeSelect = function (uIdx, currentIdx, unitIdx) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'projectUserList';
    params.set('flag', flag)
    params.set('uIdx', uIdx);
    params.set('currentIdx', currentIdx);
    params.set('unitIdx', unitIdx);
    return _baseRequest_url(url, params)
}
ShouYe.anBaoSelect = function (uIdx, currentIdx) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'SecurityUserList';
    params.set('flag', flag)
    params.set('uIdx', uIdx);
    params.set('currentIdx', currentIdx);
    return _baseRequest_url(url, params)
}
ShouYe.confirmJingLi = function (idx, personIdxS, currentJingLiCount) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'ChooseUser';
    params.set('flag', flag)
    params.set('idx', idx)
    params.set('uIdx', personIdxS)
    params.set('personType', currentJingLiCount);
    return _baseRequest_url(url, params)
}
ShouYe.signState = function (idx) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'loginInQianDaoPage';
    params.set('flag', flag)
    params.set('uIdx', idx)
    return _baseRequest_url(url, params)
}

// 任务列表
ShouYe.taskList = function (taskState = '', createdate = '', keyword = '') {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'taskList';
    params.set('flag', flag)
    params.set('taskState', taskState)
    params.set('createdate', createdate)
    params.set('keyword', keyword)
    return _baseRequest_url(url, params) 
}
ShouYe.selectTime = function () {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'GetDealTimeList';
    params.set('flag', flag)
    return _baseRequest_url(url, params)
}

export default ShouYe;