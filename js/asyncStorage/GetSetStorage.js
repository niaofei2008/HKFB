import {
    AsyncStorage,
} from 'react-native';

class GetSetStorge {
    storeUserbyid(userInforArr){
        for(var i=0;i<userInforArr.length;i++){
           AsyncStorage.setItem(userInforArr[i].uIdx.toString(),JSON.stringify(userInforArr[i]))
                    .then(()=>{})
                    .catch((error) => console.log('AsyncStorage setting error: ' + error.message))
                    .done();
        }
    }
     getUserbyid(uIdx,callback){

         AsyncStorage.getItem(uIdx)
            .then((value) => {
                jsonObject=JSON.parse(value);
                callback(jsonObject);
            })
            .catch((error) => console.log('AsyncStorage error: ' + error.message))
            .done();
    }

}
export default new GetSetStorge();
