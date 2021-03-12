<template>
	<div>
		<Home />
		<view class="cu-bar tabbar bg-white foot">
			<view class="action text-green">
				<view class="cuIcon-homefill"></view> 首页
			</view>
			
			<view class="action text-gray add-action">
				<button class="cu-btn cuIcon-add bg-green shadow"></button>
				打卡
			</view>
			<!-- <view class="action text-gray">
				<view class="cuIcon-cart">
					<view class="cu-tag badge">99</view>
				</view>
				购物车
			</view> -->
			<view class="action text-gray">
				<view class="cuIcon-my">
					<view class="cu-tag badge"></view>
				</view>
				个人中心
			</view>
		</view>
	</div>
</template>

<script>
import Home from '@/pages/home/index'
export default {
	data() {
		return {
		}
	},
	components: {
		Home
	},
	onLoad() {
	},
	methods: {
	}
}
</script>

<style>

</style>
