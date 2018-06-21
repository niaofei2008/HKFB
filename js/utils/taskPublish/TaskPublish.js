import _fetch from '../_fetch'
import { _baseRequest_url, _baseRequest_form } from '../_baseRequest'
let TaskPublish = {}

TaskPublish.submit = function (obj) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'taskAdd';
    params.set('flag', flag)
    for (let i = 0; i < Object.keys(obj).length; i++) {
        params.set(Object.keys(obj)[i], Object.values(obj)[i]);
    }
    console.log(params)
    return _baseRequest_form(url, params);
}

TaskPublish.taskUserList = function () {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'taskUserList';
    params.set('flag', flag)
    return _baseRequest_url(url, params)
}
TaskPublish.taskInfoOne = function (idx) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'taskInfoOne';
    params.set('flag', flag)
    params.set('idx', idx);
    return _baseRequest_url(url, params)
}
TaskPublish.cofirmPreHandle = function (idx, handleIdx, dealTime) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'ConfirmTaskInfo';
    params.set('flag', flag)
    params.set('idx', idx);
    params.set('handleIdx', handleIdx)
    params.set('dealTime', dealTime);
    return _baseRequest_url(url, params)
}
TaskPublish.dealTaskInfo = function (obj) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'DealTaskInfo';
    params.set('flag', flag)
    for (let i = 0; i < Object.keys(obj).length; i++) {
        params.set(Object.keys(obj)[i], Object.values(obj)[i]);
    }
    console.log(params)
    return _baseRequest_form(url, params);
}
TaskPublish.taskDeletePost = function (obj) {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'taskDelete';
    params.set('flag', flag)
    for (let i = 0; i < Object.keys(obj).length; i++) {
        params.set(Object.keys(obj)[i], Object.values(obj)[i]);
    }
    console.log(params)
    return _baseRequest_form(url, params);
}
export default TaskPublish;