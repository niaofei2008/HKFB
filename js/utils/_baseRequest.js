import _fetch from './_fetch'

export function _baseRequest_url(url, params = new Map(), token = '') {
    let promise = new Promise((resolve, reject) => {
        let q = '';
        params.forEach((value, key) => {
            q = q + '&' + key + '=' + value;
        });
        const fetchConfig = {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            }
        };
        if (token !== '') {
            url = url + '?token=' + token + q;
        } else if (q) {
            url = url + '?' + q;
        }
        console.log(url);
        _fetch(fetch(url, fetchConfig), 8000)
            .then((res) => {
                if (res.ok) {
                    res.json()
                        .then((responseJson) => {
                            if (responseJson.code === '1') {
                                console.log('res', responseJson);
                                resolve(responseJson.result);
                            } else {
                                reject(responseJson.result);
                            }
                            
                        })
                }
            })
            .catch(error => {
                console.log('error', error);
                reject(error);
            })
    })
    return promise;
}

export function _baseRequest_form(url, params) {
    let promise = new Promise((resolve, reject) => {
        let data = new FormData();
        params.forEach((value, key) => {
            data.append(key, value);
        })
        const fetchConfig = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: data
        };
        _fetch(fetch(url, fetchConfig), 20000)
            .then((res) => {
                if (res.ok) {
                    res.json()
                        .then((responseJson) => {
                            if (responseJson.code === '1') {
                                console.log('res', responseJson);
                                resolve(responseJson.result);
                            } else {
                                reject(responseJson.result)
                            }
                            
                        })
                }
            })
            .catch((error) => {
                reject(error);
            })
    })
    return promise;
}

export function _baseRongYun(url, params = new Map(), token = '') {
    let promise = new Promise((resolve, reject) => {
        let q = '';
        params.forEach((value, key) => {
            q = q + '&' + key + '=' + value;
        });
        const fetchConfig = {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            }
        };
        if (token !== '') {
            url = url + '?token=' + token + q;
        } else if (q) {
            url = url + '?' + q;
        }
        console.log(url);
        _fetch(fetch(url, fetchConfig), 8000)
            .then((res) => {
                if (res.ok) {
                    res.json()
                        .then((responseJson) => {
                            if (responseJson.code === 200) {
                                console.log('res', responseJson);
                                resolve(responseJson.token);
                            } else {
                                reject(responseJson.errorMessage);
                            }
                            
                        })
                }
            })
            .catch(error => {
                console.log('error', error);
                reject(error);
            })
    })
    return promise;
}