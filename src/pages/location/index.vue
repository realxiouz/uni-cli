<template>
  <div class="flex flex-direction" style="width:100vw;height:100vh;">
    <map
      class="map"
      style="flex:1;width:100%;"
      :markers="markers"
      :polyline="polyline"
      :scale="14"
      :min-scale="13"
      :max-scale="15"
      :show-scale="false"
      @markertap="onMark"
      :latitude="latitude"
      :longitude="longitude"
    >
      <!-- <cover-image class="loc" src="/static/img/location.png" @click="onLoc"></cover-image> -->
    </map>
    <div class="b"></div>
  </div>
</template>

<script>
let amap = require('../../libs/amap-wx')
import { AMAP_KEY } from '@/utils/const'
import { mapState } from 'vuex'
export default {
  onLoad() {
    this.aMap = new amap.AMapWX({key: AMAP_KEY})

    this.$get('api/v1/sign/map').then(r => {
      this.originPoint = r.data
      this.markers = r.data.map(i => ({
        latitude: parseFloat(i.lat),
        longitude: parseFloat(i.lng),
        title: i.name,
        iconPath: '/static/img/marker.png',
        id: i.id,
        width: '44rpx',
        height: '64rpx',
        callout: {
          content: `${i.id}: ${i.name}`,
          display: 'ALWAYS',
          color: '#fff',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#39b54a',
          bgColor: '#39b54a',
          padding: 5,
          fontSize: 12,
        }
      }))

      this.aMap.getWalkingRoute({
        origin: `${this.markers[0].longitude},${this.markers[0].latitude}`,
        destination: `${this.markers[1].longitude},${this.markers[1].latitude}`,
        success: r => {
          console.log(r)

          let points = [];
          if(r.paths && r.paths[0] && r.paths[0].steps){
            var steps = r.paths[0].steps;
            for(var i = 0; i < steps.length; i++){
              var poLen = steps[i].polyline.split(';');
              for(var j = 0;j < poLen.length; j++){
                points.push({
                  longitude: parseFloat(poLen[j].split(',')[0]),
                  latitude: parseFloat(poLen[j].split(',')[1])
                })
              } 
            }
          }
          
          this.polyline = [{
              points: [
                {longitude: this.markers[0].longitude, latitude: this.markers[0].latitude},
                ...points,
                {longitude: this.markers[1].longitude, latitude: this.markers[1].latitude},
              ],
              color: "#f00",
              width: 4
            }]
          console.log(this.polyline)
        },
        fali: e => {
          console.log(e)
        }
      })

      this.latitude = (this.markers[0].latitude + this.markers[1].latitude)/2
      this.longitude = (this.markers[0].longitude + this.markers[1].longitude) /2
    })
  },
  onShow() {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' &&  page.getTabBar()) {  
      page.getTabBar().setData({  
          selInx: 1
      })  
    }

    this.$showModal({
      content: `即将开放,敬请期待`,
      successCb: _ => {
        this.$go(`/pages/home/index`)
      }
    })

    // this.aMap.getPoiAround({
    //   success: r => {
    //     console.log(r)
    //   },
    //   fail: e => {
    //     console.log(e)
    //   }
    // })
  },
  data() {
    return {
      longitude: 0,
      latitude: 0,
      markers: [],
      polyline: [],
    }
  },
  methods: {
    onLoc() {
      console.log(1)
    },
    onMark(e) {
      if (!this.token) {
        this.$showModal({
          content: '您还未登录,无法使用该功能,点击确定去登录~~~',
          successCb: _ => {
            this.$go(`/pages/auth/login`)
          }
        })
        return
      }
      let markerId = e.detail.markerId
      let mark = this.originPoint.find(i => i.id == markerId)
      this.$go(`/pages/location/mark?json=${JSON.stringify(mark)}`)
      // wx.showActionSheet({
      //   itemList: ['扫码打卡', '拍照打卡'],
      //   success: ({tapIndex}) => {
      //     switch(tapIndex) {
      //       case 1:
      //         wx.chooseImage({
      //           sourceType: ['camera'],
      //           sizeType: ['compressed'],
      //           count: 1,
      //           success: r => {
      //             let {tempFilePaths, tempFiles} = r
      //             if (tempFilePaths && tempFilePaths.length) {
      //               this.isLoading = true
      //               this.uploadFile(tempFilePaths[0])
      //                 .then(url => {
      //                   this.$post('api/v1/sign/submit', {
      //                     url,
      //                     id: markerId
      //                   }).then(r => {
      //                       this.$showModal({
      //                         content:`拍照打卡成功,您是第${r.data.signordernum}位打卡成功者!`
      //                       })
      //                     })
      //                 })
      //                 .catch(e => {
      //                   this.$toast('上传失败，请重新上传~~')
      //                 })
      //                 .finally(_ => {
      //                   this.isLoading = false
      //                 })
      //             }
      //           },
      //           fail: e => {
      //           }
      //         })
      //         break
      //       case 0:
      //         let mark = this.originPoint.find(i => i.id == markerId)
      //         this.$go(`/pages/location/mark?json=${JSON.stringify(mark)}`)
      //         break
      //     }
      //   },
      //   fail: e => {
      //   }
      // })
    },
    uploadFile(filePath) {
      return new Promise((resolve, rej)=>{
        wx.uploadFile({
          filePath,
          url: `https://qinglong.softtiny.com/api/v1/common/upload`,
          name: 'file',
          header: {
            token: this.token
          },
          success: r => {
            if (r.statusCode == 200 && r.errMsg == 'uploadFile:ok') {
              try {
                let d = JSON.parse(r.data)
                if (d.code == 1) {
                  resolve(d.data.url)
                } else {
                  rej(new Error('格式一场'))
                }
              } catch(e) {
                rej(e)
              }
            } else {
              rej(new Error('异常'))
            }
          },
          fail: e => {
            rej(e)
            this.$toast('上传失败，请重新上传~~')
          }
        })
      })
    },
  },
  computed: {
    ...mapState('user', ['token'])
  }
}
</script>

<style>
.map{
  /* width: 100vw;
  height: 100vh; */
}

.b{
  padding: 0;
	height: calc(100rpx + env(safe-area-inset-bottom) / 2);
}

.loc{
  position: absolute;
  bottom: 100rpx;
  left: 36rpx;
  width: 64rpx;
  height: 64rpx;
}
</style>