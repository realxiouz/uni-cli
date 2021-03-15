<template>
  <div>
    <radio-group class="margin-top block" v-if="step==0&&type==1" @change="groupChange">
      <view class="cu-form-group" v-for="(i,inx) in groups" :key="inx">
        <view class="title">{{i.group_name}}</view>
        <radio :class="selGroupInx==inx?'checked':''" :checked="selGroupInx==inx" :value="inx"></radio>
      </view>
    </radio-group>

    <checkbox-group v-if="step==0&&type==2" class="block margin-top" @change="gsChange">
      <view class="cu-form-group" v-for="(i,inx) in groups" :key="inx">
        <view class="title">{{i.group_name}}</view>
        <checkbox :class="groups[inx].checked?'checked':''" :checked="groups[inx].checked" :value="i.id"></checkbox>
      </view>
    </checkbox-group>

    <template v-if="step==1">
      <template v-if="type==1"> 
        <view class="cu-form-group margin-top">
          <view class="title">姓名</view>
          <input placeholder="填写您的姓名" maxlength="10" v-model="name" name="input"></input>
        </view>
        <view class="cu-form-group">
          <view class="title">身份证号</view>
          <input placeholder="填写正确的身份证号" v-model="idcard" name="input"></input>
        </view>
        <view class="cu-form-group">
          <view class="title">手机号码</view>
          <input placeholder="填写您的手机号码" maxlength="11"  v-model="mobile" name="number"></input>
        </view>
      </template>
      <template v-if="type==2">
        <view class="cu-form-group margin-top">
          <view class="title">团队名称</view>
          <input placeholder="填写团队名称" maxlength="10" v-model="team_name" name="input"></input>
        </view>
        <view class="cu-form-group">
          <view class="title">负责人姓名</view>
          <input placeholder="填写负责人姓名" maxlength="10" v-model="team_leader" name="input"></input>
        </view>
        <view class="cu-form-group">
          <view class="title">负责人电话</view>
          <input placeholder="填写负责人电话" maxlength="11"  v-model="team_mobile" name="number"></input>
        </view>

        <div v-for="(i, inx) in selGroups" :key="inx">
          <view class="cu-list grid col-3 margin-top-sm">
            <div class="cu-item">
              <div style="height:72rpx;line-height:72rpx;" class="text-xl text-green">组名</div>
              <div class="text-sm text-gray">{{selGroups[inx].group_name}}</div>
            </div>
            <div class="cu-item">
              <div style="height:72rpx;line-height:72rpx;" class="text-xl text-red">人数</div>
              <div class="text-sm text-gray">已添加:{{selGroups[inx].members.length}}/{{selGroups[inx].num}}</div>
            </div>
            <div class="cu-item" @click="onAddMember(inx)">
              <!-- <div class="text-xl text-yellow">添加组员</div> -->
              <div style="height:72rpx;" class="flex justify-center align-center">
                <div style="margin-top:0;width:auto;"  class="cuIcon-roundaddfill text-yellow"></div>
                <div class="text-yellow text-xl">添加组员</div>
              </div>
              <div class="text-sm text-gray">每人¥{{selGroups[inx].price}}</div>
            </div>
          </view>

          <view class="cu-list menu" :class="[true?'sm-border':'',true?'card-menu margin-top-sm':'']">
            <view v-for="(item,index) in selGroups[inx].members" :key="index" class="cu-item">
              <view class="content">
                <view>
                  <span class="text-bold">{{item.person_name}}</span>
                  <span class="text-gray margin-left-sm">{{item.mobile}}</span>
                </view>
                <view class="text-gray text-sm">
                  {{item.idcard}}
                </view>
              </view>
              <div class="action" @click="onDelMem(inx, index)">
                <div class="cuIcon-deletefill text-red"></div>
              </div>
            </view>
          </view>
        </div>

      </template>
    </template>

    <modal :show.sync="showConfirm" :is-bottom="false" :click-out="false">
      <div class="">
        <view class="cu-bar bg-white justify-end">
					<view class="content">确认报名信息</view>
					<view class="action" @tap="showConfirm=false">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
        <view class="cu-list menu text-left">
          <template v-if="type==1">
            <view class="cu-item">
              <view class="content">
                <text class="cuIcon-friendadd text-grey"></text>
                <text class="text-grey">姓名</text>
              </view>
              <div class="action">
                {{name}}
              </div>
            </view>
            <view class="cu-item">
              <view class="content">
                <text class="cuIcon-mobile text-grey"></text>
                <text class="text-grey">手机号</text>
              </view>
              <div class="action">
                {{mobile}}
              </div>
            </view>
            <view class="cu-item">
              <view class="content">
                <text class="cuIcon-vipcard text-grey"></text>
                <text class="text-grey">身份证号</text>
              </view>
              <div class="action">
                {{idcard}}
              </div>
            </view>
            <!-- <view class="cu-item">
              <view class="content">
                <text class="cuIcon-recharge text-grey"></text>
                <text class="text-grey">支付费用</text>
              </view>
              <div class="action text-red">
                ¥{{'100.00'}}
              </div>
            </view> -->
          </template>
          <template v-if="type==2">
            <view class="cu-item">
              <view class="content">
                <text class="cuIcon-group text-grey"></text>
                <text class="text-grey">团队名称</text>
              </view>
              <div class="action">
                {{team_name}}
              </div>
            </view>
            <view class="cu-item">
              <view class="content">
                <text class="cuIcon-friendadd text-grey"></text>
                <text class="text-grey">负责人姓名</text>
              </view>
              <div class="action">
                {{team_leader}}
              </div>
            </view>
            <view class="cu-item">
              <view class="content">
                <text class="cuIcon-mobile text-grey"></text>
                <text class="text-grey">负责人手机号</text>
              </view>
              <div class="action">
                {{team_mobile}}
              </div>
            </view>
            <!-- <view class="cu-item">
              <view class="content">
                <text class="cuIcon-recharge text-grey"></text>
                <text class="text-grey">支付费用</text>
              </view>
              <div class="action text-red">
                ¥{{'100.00'}}
              </div>
            </view> -->
          </template>
        </view>
        <view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-gray " @tap="showConfirm=false">取消</view>
					<view class="action margin-0 flex-sub text-green solid-left" @tap="onPay">
						<!-- <text class="cuIcon-moneybag"></text>微信支付 -->
            确定
          </view>
				</view>
      </div>
    </modal>

    <modal :show.sync="showAddMember" :is-bottom="false" :click-out="false">
      <div >
        <view class="cu-bar bg-white justify-end">
					<view class="content">添加组员</view>
					<view class="action" @tap="showAddMember=false">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
        <view class="cu-form-group">
          <view class="title">姓名</view>
          <input class="text-left" placeholder="填写组员的姓名" maxlength="10" v-model="memberForm.person_name" name="input"></input>
        </view>
        <view class="cu-form-group">
          <view class="title">身份证号</view>
          <input class="text-left" placeholder="填写正确的身份证号" v-model="memberForm.idcard" name="input"></input>
        </view>
        <view class="cu-form-group">
          <view class="title">手机号码</view>
          <input class="text-left" placeholder="填写组员的手机号码" maxlength="11"  v-model="memberForm.mobile" name="number"></input>
        </view>
        <view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-gray " @tap="showAddMember=false">取消</view>
					<view class="action margin-0 flex-sub text-green solid-left" @tap="onMemAdd">
						确认添加
          </view>
				</view>
      </div>
    </modal>

    <div style="height:120rpx;"></div>
    <view class="cu-bar bg-white btn-group foot">
      <button @click="onPre" class="cu-btn bg-green shadow-blur round">上一步</button>
      <button @click="onNext" class="cu-btn bg-blue shadow-blur round">下一步</button>
    </view>
  </div>
</template>

<script>
export default {
  onLoad(opt) {
    this.project_id = opt.pId
    this.type = opt.type // 1 => 个人; 2 => 多人

    this.getGroup()
  },
  data() {
    return {
      showConfirm: false,

      name: '',
      mobile: '',
      idcard: '',
      project_id: '',

      step: 0,

      type: 1,

      groups: [],
      selGroupInx: -1,

      team_name: '',
      team_mobile: '',
      team_leader: '',
      showAddMember: false,
      memberForm: {
        person_name: '',
        idcard: '',
        mobile: '',
      },

      selGroups: [],
      selGroupsInx: -1
    }
  },
  methods: {
    onPay() {
      if (this.type == 1) {
        let d = {
          name: this.name,
          mobile: this.mobile,
          idcard: this.idcard,
          group_id: this.groups[this.selGroupInx].id,
          project_id: this.project_id
        }
        this.$post('api/v1/project/submit',d)
          .then(r => {
            this.$showModal({
              content: '订单创建成功,去报名列表看看吧~~~',
              successCb: _ => {
                this.$go('/pages/order/list', 'redirect')
              }
            })
          })
      } else if (this.type == 2) {
        // let g = this.members.map(i => {
        //   i.group_id = this.groups[this.selGroupInx].id
        //   return i
        // })
        let g = []
        for (let i = 0; i < this.selGroups.length; i++) {
          g = [...g, ...this.selGroups[i].members.map(j => ({
            group_id: this.selGroups[i].id,
            person_name: j.person_name,
            idcard: j.idcard,
            mobile: j.mobile,
          }))]
        }
        let d = {
          project_id: this.project_id,
          team_name: this.team_name,
          team_leader: this.team_leader,
          team_mobile: this.team_mobile,
          group: g
        }

        console.log(d)
        this.$post('api/v1/project/team_submit', d)
          .then(r => {
            this.$showModal({
              content: '订单创建成功,去报名列表看看吧~~~',
              successCb: _ => {
                this.$go('/pages/order/list', 'redirect')
              }
            })
          })
      }
    },
    onPre() {
      if (this.step == 1) {
        this.step--
      }
    },
    onNext() {
      if (this.step == 0) {
        if (this.type==1) {
          if (this.selGroupInx == -1) {
            this.$toast('请首先选择组别')
            return
          }
        }
        if (this.type == 2) {
          if (!this.groups.filter(i => i.checked).length) {
            this.$toast('请首先选择组别')
            return
          }
          this.selGroups = this.groups.filter(i => i.checked).map(i => {
            i.members = []
            return i
          })
        }
        this.step++
      } else if (this.step == 1) {
        if (this.type == 1) {
          this.confirmSingle()
        } else if (this.type == 2) {
          this.confirmGroup()
        }
      }

    },
    confirmSingle() {
      if (!this.name.trim()) {
        this.$toast('请填写姓名')
        return
      }
      if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.idcard)) {
        this.$toast('请填写正确的十八位身份证')
        return
      }
      if (!/^1\d{10}$/.test(this.mobile)) {
        this.$toast('请填写正确的手机号码')
        return
      }
      this.showConfirm=true
    },
    confirmGroup() {
      if (!this.team_name.trim()) {
        this.$toast('请填写团队名称')
        return
      }
      if (!this.team_leader.trim()) {
        this.$toast('请填写负责人姓名')
        return
      }
      if (!/^1\d{10}$/.test(this.team_mobile)) {
        this.$toast('请填写负责人手机号码')
        return
      }
      let g = []
      for (let i = 0; i < this.selGroups.length; i++) {
        g = [...g, ...this.selGroups[i].members.map(j => ({
          group_id: this.selGroups[i].id,
          person_name: j.person_name,
          idcard: j.idcard,
          mobile: j.mobile,
        }))]
      }
      if (!g.length) {
        this.$toast('还没有选择组员呢~')
        return
      }
      this.showConfirm=true
    },
    getGroup() {
      this.$get('api/v1/group/index', { project_id: this.project_id})
        .then(r => {
          this.groups = r.data.data.map(i => {
            i.checked = false
            return i
          })
          if (this.type == 1) {
            this.groups = this.groups.filter(i => i.group_name != '亲子组')
            console.log(this.groups)
          }
        })
    },
    groupChange(e) {
      this.selGroupInx = e.detail.value
    },
    onAddMember(inx) {
      if (this.selGroups[inx].members.length >= this.selGroups[inx].num) {
        this.$toast('当前组员已经达到最大人数了...')
      } else {
        this.showAddMember = true
        this.selGroupsInx = inx
      }
    },
    onMemAdd() {
      if (!this.memberForm.person_name.trim()) {
        this.$toast('必须填写组员姓名')
        return
      }
      this.selGroups[this.selGroupsInx].members.push(this.memberForm)
      this.showAddMember = false
      this.memberForm = {
        mobile: '',
        person_name: '',
        idcard: '',
      }
    },
    onDelMem(inx, index) {
      this.$showModal({
        content: `确定要在${this.selGroups[inx].group_name}组里删除组员:${this.selGroups[inx].members[index].person_name}?`,
        successCb: _ => {
          this.selGroups[inx].members.splice(index, 1)
          this.$forceUpdate()
        },
        showCancel: true,
      })
    },
    gsChange(e) {
      var items = this.groups,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					items[i].checked = false;
					for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
						if (items[i].id == values[j]) {
							items[i].checked = true;
							break
						}
					}
				}
    }
  }
}
</script>

<style>
.title{
  min-width: calc(5em + 15px);
}
</style>