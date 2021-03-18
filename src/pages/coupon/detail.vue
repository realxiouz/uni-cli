<!-- 优惠劵详情 -->
<template>
	<view class="page_box">
		<view class="content_box">
			<scroll-view class="scroll-box" scroll-y="true" scroll-with-animation enable-back-to-top :scroll-into-view="scrollId" @scroll="onScroll">
				<view class="coupon-box text-center">
					<view class="top y-f">
						<view class="img-box x-c" ><image class="coupon-img" style="margin-top:20rpx;"  src="https://shopro.7wpp.com/imgs/coupon.png" mode=""></image></view>
						<view class="title">{{ couponDetail.amount }}元优惠券</view>
						<view class="tip">满{{ couponDetail.enough }}元可用</view>
						<button class="cu-btn " :class="btnStataus == 'no_use' || !btnStataus ? 'use-btn' : 'fail-btn'" @tap="goScroll">
							{{ btnStatusText[btnStataus] || '立即领取' }}
						</button>
						<view class="time" v-if="couponDetail.usetime">
							有效期：{{ couponDetail.usetime.start | time }} 至 {{ couponDetail.usetime.end | time }}
						</view>
						<view class="coupon-line"></view>
					</view>
					<view class="bottom y-start">
						<view class="notice-item y-start">
							<view class="notice-title">优惠券说明</view>
							<view class="notice-detail">{{ couponDetail.description }}</view>
						</view>
					</view>
				</view>
				<view class="coupon-goods" v-if="couponGoods.length">
					<view class="coupon-goods-title x-f">适用门店</view>
					<view class="goods-list" v-for="i in couponGoods" :key="i.id" @click="onGoLocation(i)">
						<view class="goods-box x-start flex align-center" >
							<image class="goods-img" :src="i.image_first" mode="aspectFill"></image>
							<view class="y-start flex-sub">
								<view class="goods-title more-t">{{ i.name }}</view>
								<view class="size-tip">{{ i.address }}</view>
								<div class="cu-tag bg-green round">{{i.phone}}</div>
							</view>
							<div class="cuIcon-forwardfill text-green" style="font-size:20px;">

							</div>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			couponDetail: {},
			tools: this.$tools,
			couponGoods: [],
			scrollId: '',
			nowTime: new Date().getTime(),
			options: {},
			btnStatusText: {
				no_use: '立即使用',
				used: '已使用',
				expired: '已失效',
				no_can_use: '暂不可用'
			},
			btnStataus: ''
		};
	},
	computed: {},
	onLoad(opt) {
		this.opt = opt
		this.getCouponDetail();
		this.getCouponGoods();
	},
	methods: {
		// 领取优惠劵
		getCoupon() {
			let that = this;
			that.$api('coupons.get', {
				id: that.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast(res.msg);
					this.options.userCouponId = res.data.id;
					that.getCouponDetail();
				}
			});
		},
		// 优惠券详情
		getCouponDetail() {
			this.$get(`api/v1/coupons/detail`, {
				id: this.opt.id,
				user_coupons_id: this.opt.userCouponId
			}).then(r => {
				this.couponDetail = r.data
				if (r.data.status_code) {
					this.btnStataus = r.data.status_code
				}
			})
		},
		// 适用商品
		getCouponGoods() {
			this.$get(`api/v1/store/lists`)
				.then(r => {
					this.couponGoods = r.data.data
				})
			// let that = this;
			// that.$api('coupons.goods', {
			// 	id: that.$Route.query.id
			// }).then(res => {
			// 	if (res.code === 1) {
			// 		that.couponGoods = res.data.data;
			// 	}
			// });
		},
		onScroll() {
			this.scrollId = '';
		},
		goScroll() {
			if (!this.options.userCouponId) {
				this.getCoupon();
			} else {
				if (this.couponDetail.goods_ids === '0' && this.btnStataus == 'no_use') {
					this.$Router.push({
						path: '/pages/goods/list'
					});
				}
				this.scrollId = 'couponGoods';
			}
		},
		onGoLocation(i) {
			wx.openLocation({
				latitude: parseFloat(i.latitude),
				longitude: parseFloat(i.longitude)
			})
		}
	}
};
</script>

<style lang="less">
.page_box {
	background: linear-gradient(180deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
	min-height: 100vh;
}
.coupon-box {
	margin: 100rpx 30rpx 0;
	background: #fff;
	border-radius: 20rpx;
	.top {
		border-radius: 20rpx 20rpx 0 0;
		background-image: radial-gradient(circle at bottom left, #f0c785, #f0c785 16rpx, transparent 17rpx),
			radial-gradient(circle at bottom right, #f0c785, #f0c785 16rpx, transparent 17rpx);
		padding: 110rpx 0 40rpx 0;
		position: relative;
		z-index: 5;
		.coupon-line {
			width: 95%;
			border-bottom: 2rpx dashed #f3ce90;
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			z-index: 6;
		}
		.img-box {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			background: #fff;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: -70rpx;
			.coupon-img {
				width: 100rpx;
				height: 100rpx;
			}
		}
		.title {
			font-size: 40rpx;
			font-weight: bold;
			line-height: 40rpx;
			margin-bottom: 30rpx;
		}
		.tip {
			font-size: 28rpx;
			font-weight: 500;
			margin-bottom: 50rpx;
		}
		.use-btn {
			width: 386rpx;
			height: 80rpx;
			background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
			border-radius: 40rpx;
			color: rgba(#fff, 0.9);
			margin-bottom: 30rpx;
		}
		.fail-btn {
			width: 386rpx;
			height: 80rpx;
			background: rgba(245, 245, 245, 1);
			border-radius: 40rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(188, 188, 188, 1);
			margin-bottom: 30rpx;
		}
		.time {
			color: #999;
			font-size: 26rpx;
		}
	}
	.bottom {
		border-radius: 0 0 20rpx 20rpx;
		background-image: radial-gradient(circle at top left, #f0c785, #f0c785 16rpx, transparent 17rpx),
			radial-gradient(circle at top right, #f0c785, #f0c785 16rpx, transparent 17rpx);
		padding: 40rpx 30rpx;
		.notice-item {
			border-bottom: 1rpx solid #eeeeee;
			min-height: 90rpx;
			width: 100%;
			.notice-title {
				font-weight: 500;
				font-size: 26rpx;
			}
			.notice-detail {
				font-size: 24rpx;
				color: #666;
				margin-top: 10rpx;
				padding-bottom: 10rpx;
			}
		}
	}
}
// 优惠券商品
.coupon-goods {
	background: #fff;
	margin: 20rpx;
	padding: 20rpx;
	border-radius: 20rpx;
	/deep/.goods-title {
		width: 420rpx;
	}
	.goods-list {
		padding: 20rpx 0;
		border-bottom: 1rpx solid rgba(223, 223, 223, 0.5);
	}
	.coupon-goods-title {
		font-size: 30rpx;
		font-weight: bold;
		height: 80rpx;
	}
}

.goods-box {
	position: relative;
	.goods-img {
		height: 180rpx;
		width: 180rpx !important;
		background-color: #ccc;
		margin-right: 25rpx;
	}
	.order-goods__tag {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 5;
		.tag-img {
			width: 60rpx;
			height: 30rpx;
		}
	}
	.goods-title {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		width: 450rpx;
		line-height: 40rpx;
		margin-bottom: 10rpx;
	}

	.size-tip {
		line-height: 40rpx;
		// background: #f4f4f4;
		// padding: 0 16rpx;
		font-size: 24rpx;
		color: #666;
	}
	.sub-tip {
		width: 480rpx;
		line-height: 40rpx;
		// background: #F6F2EA;
		font-size: 24rpx;
		color: #a8700d;
		margin: 10rpx 0;
	}

	.price {
		color: #e1212b;
	}
}
</style>
