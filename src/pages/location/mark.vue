<template>
  <div>

    <view class="cu-list menu" :class="[true?'sm-border':'',true?'card-menu margin-top-sm':'']">
      <div class="cu-item">
        <view class="content padding-tb-sm">
          <view class="text-bold text-center text-cut justify-center">
            {{markData.name}}
          </view>
        </view>
      </div>
      <!-- <view class="cu-item">
        <view class="content padding-tb-sm">
          <view class="text-bold">
            报名时间
          </view>
          <view class="text-gray text-sm">
            {{start_time_text}} - {{end_time_text}}
          </view>
        </view>
      </view> -->
    </view>

    <view class="cu-timeline margin-top-sm">
			<view class="cu-time">打卡条件</view>
      <view class="cu-item text-red cuIcon-wifi">
				<view class="content  shadow-blur" :class="networkType?'bg-green':'bg-yellow'">
					<span class="margin-right-sm" :class="networkType?'cuIcon-roundcheckfill':'cuIcon-roundclosefill'"></span>
          当前使用{{networkType}}网络.
				</view>
			</view>
			<view class="cu-item cur text-blue cuIcon-locationfill">
				<view class="content  shadow-blur" :class="isDistanceOk?'bg-green':'bg-yellow'">
					<span class="margin-right-sm" :class="isDistanceOk?'cuIcon-roundcheckfill':'cuIcon-roundclosefill'"></span> 当前位置距离打卡点: {{distance}}km
          <br />
          <div class="cu-btn bg-pink round sm margin-top-sm" @click="getLocation">重新定位</div>
				</view>
			</view>
			
		</view>

    <view class="padding">
			<button class="cu-btn block bg-green margin-tb-sm lg" @click="onMark">打卡</button>
		</view>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  onLoad(opt) {
    if (opt.json) {
      this.markData = JSON.parse(opt.json)
    }
    this.getNetInfo()
    this.getLocation()
  },
  onShow() {

  },
  data() {
    return {
      networkType: '',
      distance: '定位中',
      isDistanceOk: false,
      markData: {}
    }
  },
  methods: {
    getNetInfo() {
      wx.getNetworkType()
        .then(r => {
          this.networkType = r.networkType
        })
    },
    getLocation() {
      this.$getWxAuthSetting('userLocation')
        .then( ({isRequired, isAllowed}) => {
          if (isAllowed || !isRequired) {
            wx.getLocation({
              type: 'gcj02',
            })
              .then(r => {
                let {latitude, longitude} = r
                this.distance = this.getDistance(latitude, longitude, this.markData.lat, this.markData.lng)
                this.isDistanceOk = this.distance < 0.5
              })
          } else {
            this.$showModal({
              content: '系统检测您没有打开定位权限，请授权后重试！' ,
              successCb: _ => {
                wx.openSetting()
              }
            })
          }
        })
    },
    getDistance(la1, lo1, la2, lo2) {
      let La1 = la1 * Math.PI / 180.0;
      let La2 = la2 * Math.PI / 180.0;
      let La3 = La1 - La2;
      let Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
      s = s * 6378.137;
      s = Math.round(s * 10000) / 10000;
      s = s.toFixed(2);
      return s;
    },
    onMark() {
      if (!this.isDistanceOk || !this.networkType) {
        this.$toast('打卡条件不满足')
        return
      }

      let markerId = this.markData.id
      wx.showActionSheet({
        itemList: ['扫码打卡', '拍照打卡'],
        success: ({tapIndex}) => {
          switch(tapIndex) {
            case 1:
              wx.chooseImage({
                sourceType: ['camera'],
                sizeType: ['compressed'],
                count: 1,
                success: r => {
                  let {tempFilePaths, tempFiles} = r
                  if (tempFilePaths && tempFilePaths.length) {
                    this.isLoading = true
                    this.uploadFile(tempFilePaths[0])
                      .then(url => {
                        this.$post('api/v1/sign/submit', {
                          url,
                          id: markerId
                        }).then(r => {
                            this.$showModal({
                              content:`拍照打卡成功,您是第${r.data.signordernum}位打卡成功者!`
                            })
                          })
                      })
                      .catch(e => {
                        this.$toast('上传失败，请重新上传~~')
                      })
                      .finally(_ => {
                        this.isLoading = false
                      })
                  }
                },
                fail: e => {
                }
              })
              break
            case 0:
              this.$toast('todo...')
              break
          }
        },
        fail: e => {
        }
      })
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

</style>