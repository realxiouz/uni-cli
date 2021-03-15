<template>
  <div class="flex flex-direction" style="width:100vw;height:100vh;">
    <map
      class="map"
      style="flex:1;width:100%;"
      :markers="markers"
      :polyline="polyline"
      :scale="14"
      :show-scale="true"
      @markertap="onMark"
      :latitude="latitude"
      :longitude="longitude"
    >
      <!-- <cover-view></cover-view> -->
      <cover-image class="loc" src="/static/img/location.png" @click="onLoc"></cover-image>
    </map>
    <div class="b"></div>
  </div>
</template>

<script>
let amap = require('../../libs/amap-wx')
import { AMAP_KEY } from '@/utils/const'
export default {
  onLoad() {
    this.aMap = new amap.AMapWX({key: AMAP_KEY})

    this.$get('api/v1/sign/map').then(r => {
      this.markers = r.data.map(i => ({
        latitude: parseFloat(i.lat),
        longitude: parseFloat(i.lng),
        title: i.title,
        iconPath: '/static/img/marker.png',
        id: i.id,
        width: '44rpx',
        height: '64rpx',
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
              points: points,
              color: "#f00",
              width: 6
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
      content: `打卡功能3月19日上线, 先去首页看看吧~~~`,
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
      console.log(e.detail)
      wx.showActionSheet({
        itemList: ['扫码打卡', '拍照打卡'],
        success: r => {
          console.log(r)
        },
        fail: e => {
          console.log(e)
        }
      })
    }
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