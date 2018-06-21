import _fetch from '../_fetch'
import { _baseRequest_url } from '../_baseRequest'
let AddressBook = {}

AddressBook.info = function (unitIdx = '', keyword='') {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'tongXunLu';
    params.set('flag', flag)
    params.set('unitIdx', unitIdx)
    params.set('keyword', keyword);
    return _baseRequest_url(url, params);
}
AddressBook.unitList = function () {
    let url = HOST + 'innerData01.aspx'
    let params = new Map();
    let flag = 'unitList';
    params.set('flag', flag);
    return _baseRequest_url(url, params);
}
export default AddressBook;