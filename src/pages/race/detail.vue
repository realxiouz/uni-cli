<template>
  <div>
    <img :src="image" style="width:100%;" mdoe="widthFix">

    <view class="cu-list menu" :class="[true?'sm-border':'',true?'card-menu margin-top-sm':'']">
      <div class="cu-item">
        <view class="content padding-tb-sm">
          <view class="text-bold text-center text-cut justify-center">
            {{project_name}}
          </view>
        </view>
      </div>
      <view class="cu-item">
        <view class="content padding-tb-sm">
          <view class="text-bold">
            报名时间
          </view>
          <view class="text-gray text-sm">
            {{start_time_text}} - {{end_time_text}}
          </view>
        </view>
      </view>
      <view class="cu-item">
        <view class="content padding-tb-sm">
          <view class="text-bold">
            比赛时间
          </view>
          <view class="text-gray text-sm">
            {{game_time}}
          </view>
        </view>
      </view>
      <view class="cu-item">
        <view class="content padding-tb-sm">
          <view class="text-bold">
            参赛组别
          </view>
          <view class="text-gray text-sm">
            {{groupNames.join('/')}}
          </view>
        </view>
      </view>
      <view class="cu-item">
        <view class="content padding-tb-sm">
          <view class="text-bold">
            比赛地点
          </view>
          <view class="text-gray text-sm">
            {{game_address}}
          </view>
        </view>
      </view>
    </view> 

    <scroll-view scroll-x class="bg-green nav text-center margin-top-sm">
      <div class="flex text-center">
        <view class="cu-item flex-sub" v-for="(i,inx) in tab" :key="inx" :class="inx==curInx?'text-white cur':''" @click="tabSelect(inx)" >
          {{i}}
        </view>
      </div>
		</scroll-view>

    <div class="margin-top-sm">
      <div v-if="curInx==0" class="cu-list menu sm-border card-menu margin-top-sm">
        <div class="cu-item">
          <view class="content padding-tb-sm">
            <div class="text-gray">{{content}}</div>
          </view>
        </div>
      </div>

      <div v-if="curInx==1" class="cu-card">
        <view class="cu-list menu-avatar comment solids-top" v-for="(i,inx) in list" :key="inx">
					<view class="cu-item" style="padding: 30rpx;">
						<!-- <view class="cu-avatar round">
              
            </view> -->
						<view class="content">
							<view class="text-bold">{{i.article_title}}</view>
							<view class="text-gray text-content text-df">
								{{i.content}}
							</view>
							<view class="margin-top-sm flex justify-between">
								<view class="text-gray text-df">{{i.datetime}}</view>
								<view>
                  <div class="text-sm text-gray">{{i.author}}</div>
									<!-- <text class="cuIcon-appreciatefill text-red"></text>
									<text class="cuIcon-messagefill text-gray margin-left-sm"></text> -->
								</view>
							</view>
						</view>
					</view>
				</view>
      </div>
    </div>

    <div style="height:120rpx;"></div>
    <view class="cu-bar bg-white tabbar border foot">
      <view class="cu-avatar-group">
        <view class="cu-avatar round" v-for="(item,index) in orderMembers.slice(0,3)" :key="index" :style="[{ backgroundImage:'url(' + item + ')' }]"></view>
      </view>
      <div class="font14 flex-sub">共<span class="text-green">{{orderMembers.length}}</span>人报名</div>
      <view class="text-center" :class="canForm?'bg-green':'bg-gray'" style="width:200rpx;line-height:100rpx;" @click="onConfirm">立即报名</view>
    </view>
  </div>
</template>

<script>
export default {
  onLoad(opt) {
    this.opt = opt
    this.getData()
  },
  data() {
    return {
      image: '',
      project_name: '',
      orderMembers: [],

      game_address: '',
      groupNames: [],
      content: '',
      game_time: '',
      start_time_text: '',
      end_time_text: '',

      tab: ['赛事介绍', '赛事新闻'],
      curInx: 0,

      list: [],
      canForm: true
    }
  },
  methods: {
    getData() {
      let d = {
        id: this.opt.id
      }
      this.$get('api/v1/project/info', d)
        .then(r => {
          console.log(r.data)
          let { image, project_name, orderMembers, game_address, groupNames, start_time_text, content, end_time_text, game_time,
            start_time, end_time,
          } = r.data
          this.image = image
          this.project_name = project_name
          this.orderMembers = orderMembers.map(i => i.avatar)
          this.game_address = game_address
          this.groupNames = groupNames
          this.start_time_text = start_time_text
          this.end_time_text = end_time_text
          this.content = content
          this.game_time = game_time

          this.canForm = new Date().getTime() > start_time * 1000 && new Date().getTime() < end_time * 1000
        })
      
      this.$get(`api/v1/article/index`, { project_id : this.opt.id} )
        .then(r => {
          this.list = r.data.data
        })
    },
    onConfirm() {
      if (this.canForm) {
        this.$go(`/pages/race/form?pId=${this.opt.id}`)
      } else {
        this.$toast('不在报名时间内...')
      }
    },
    tabSelect(inx) {
      if (this.curInx != inx) {
        this.curInx = inx
      }
    }
  }
}
</script>

<style>

</style>