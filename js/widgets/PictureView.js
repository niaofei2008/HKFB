/**
 * Created by Jason on 2017/8/9.
 */

import React, {Component} from 'react'
import {
    Animated,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    DeviceEventEmitter,
} from 'react-native'

import {
    gStyles,
    gSizes,
    gColors,
} from '../utils/GlobalData'
import ImagePicker from 'react-native-image-crop-picker';
import sources from '../../images/_sources';
import ActionSheetModal from './ActionSheetModal';

export default class PictureView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pictureSources:[],
            pictures:[],
            showModal: false,
            images: this.props.images ? this.props.images : [],
        }
    }
    componentDidMount() {
        // console.log('images', this.state.images)
        if (this.state.images.length > 0) {
            this.setState({
                pictureSources: this.state.images.map(image => {
                    return {uri: HOST_UPLOAD + image}
                }),
                pictures: this.state.images
            })
        }
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <View style={styles.container}>
                {this._renderView()}
                <ActionSheetModal
                    cellsArr={['拍照','从手机相册选择']}
                    actionvisible={this.state.showModal}
                    cancelFunc={()=> this.setState({showModal: false})}
                    onPress={(index)=> this._onPickPhotoModalItemPress(index)}
                />
            </View>
        );
    }

    _onPickPhotoModalItemPress(index) {
        if (index === 0) {
            //打开相机
            ImagePicker.openCamera({width: 300, height: 400, cropping: true, includeBase64: true,})
                .then(image => {
                    let pictures =  this.state.pictures.concat(image);
                    let pictureSources = this.state.pictureSources.concat({uri: image.path});
                    this.setState({
                        pictureSources: pictureSources,
                        pictures: pictures,
                        showModal: false,
                    })
                });
        } else {
            //打开相册
            ImagePicker.openPicker({width: 300, height: 400, maxFiles: 1, cropping: true, includeBase64: true})
                .then(image => {
                    console.log('image', image)
                    let pictures = this.state.pictures.concat(image);
                    let pictureSources = this.state.pictureSources.concat({uri: image.path});
                    this.setState({
                        pictureSources: pictureSources,
                        pictures: pictures,
                        showModal: false,
                    })
                });
        }
    }

    _renderView(){
        console.log('pictures', this.state.pictureSources)
        let subViews = [];
        let pWidth = (gSizes.screen_width - gSizes.space_screen * 2 - gSizes.space_border * 4)/5;
        for (let i = 0; i < 5; i++){
            if (i === this.state.pictureSources.length){
                subViews.push(
                    <TouchableOpacity key={i} onPress={()=> this.setState({showModal:true})}>
                        <Image style={{height:pWidth,width:pWidth,marginRight:gSizes.space_border}}
                               source={sources.add}
                               resizeMode='contain'/>
                    </TouchableOpacity>
                )
            }else {
                subViews.push(
                    <TouchableOpacity key={i} onPress={()=> this._pressPicture(i)}>
                        <Image style={{height:pWidth,width:pWidth,marginRight:gSizes.space_border,borderWidth:1,borderColor:gColors.text_grayb}}
                               source={this.state.pictureSources[i]}/>
                    </TouchableOpacity>
                )
            }
        }

        return subViews ;
    }

    _pressPicture(index){
        let pictrueSources = this.state.pictureSources;
        let pictrues = this.state.pictures;
        pictrues.splice(index,1);
        pictrueSources.splice(index,1);
        this.setState({
            pictures:pictrues,
            pictureSources:pictrueSources,
        })
    }

    _getPictures(){
        return this.state.pictures;
    }
    _setPictures() {

    }
    _clearPictures(){
        this.setState({
            pictures:[],
            pictureSources:[],
        })
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal:gSizes.space_screen,
        paddingVertical:gSizes.space_border,
        backgroundColor: 'white',
    }
});