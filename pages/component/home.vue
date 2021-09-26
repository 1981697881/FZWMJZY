<template name="components">
	<view>
		<view class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
			<view class="cu-dialog" style="height: 280upx;">
				<view class="cu-bar bg-white justify-end" style="height: 60upx;">
					<view class="content">图号查询</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="padding-sm">
					<view class="cu-item">
						<view class="content">
							<text class="text-grey" style="float: left;">图号：</text>
							<input name="input" style="font-size: 13px;border-bottom:1px solid #C8C7CC;" v-model="chartNumber" />
						</view>
					</view>
				</view>
				<view style="clear: both;" class="cu-bar bg-white justify-end padding-bottom-xl">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="$manyCk(scanClick)">扫码查询</button>
						<button class="cu-btn bg-green margin-left" @tap="$manyCk(fabClick)">按输入结果查询</button>
					</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page">
			<view class="cu-bar bg-cyan">
				<view></view>
				<view class="content"></view>
				<view class="action" style="margin-top: 15px;">
					<navigator :url="'/pages/component/setting'"><text class="cuIcon-settings" style="font-size: 21px;"></text></navigator>
				</view>
			</view>
			<view class="nav-list">
				<navigator
					hover-class="none"
					v-if="item.color == 'olive' ? false : true"
					:url="'/pages/component/' + item.path + '?id=' + item.id"
					class="nav-li"
					navigateTo
					:class="'bg-' + item.color"
					v-for="(item, index) in elements"
					:key="index"
				>
					<view class="nav-title">{{ item.name }}</view>
					<text :class="'cuIcon-' + item.cuIcon"></text>
				</navigator>
				<view v-if="item.color == 'olive'" @tap="$manyCk(showModal)" class="nav-li" :class="'bg-' + item.color" v-for="(item, index) in elements" :key="index">
					<view class="nav-title">{{ item.name }}</view>
					<text :class="'cuIcon-' + item.cuIcon"></text>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
</template>

<script>
import service from '@/service.js';
import basic from '@/api/basic';
import login from '@/api/login';
export default { 
	created() {
		if (service.getUsers().length > 0) {
			console.log(service.getUsers()[0].account != '' && service.getUsers()[0].account != 'undefined');
			if (service.getUsers()[0].account != '' && service.getUsers()[0].account != 'undefined') {
				basic
					.getSysMenuById(-1)
					.then(rest => {
						/* if(rest.code == 20010){
							return uni.reLaunch({
								url: '../login/login'
							});
						}else{ */
							this.elements = rest.data;
						/* } */
						/* let data = rest.data
							let list = this.elements
							list.forEach((item, index) => {
								for(let j in data){
									if(item.name == (j+'')){
										if(data[j] == 1){
											item.isDis = 'inherit'
										}else{
										item.isDis = 'none'
									}
									}
								}
							})
							console.log(list) */
					})
					.catch(errt => {
						uni.showToast({
							icon: 'none',
							title: errt.msg
						});
					});
			} else {
				return uni.reLaunch({
					url: '../login/login'
				});
			}
		} else {
			return uni.reLaunch({
				url: '../login/login'
			});
		}
	},
	data() {
		return {
			modalName: null,
			chartNumber: '',
			elements: [
			]
		};
	},
	methods: {
		showModal(e) {
			this.modalName = 'Modal'
		},
		hideModal(e) {
			this.modalName = null
		},
		logout(){
			login
				.logout()
				.then(reso => {
					console.log(reso)
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					})
				})
		},
		fabClick() {
			if (this.chartNumber != null && this.chartNumber != '') {
				console.log(this.chartNumber)
				// 预览图片
				uni.navigateTo({
					url: '/pages/component/warehouse/documentEnquiry?chartNumber=' + this.chartNumber
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '请输入图号'
				});
			}
		},
		scanClick() {
			var that = this
			let resultA = []
			uni.scanCode({
				success: function(res) {
					basic
						.barcodeScan({ uuid: res.result })
						.then(reso => {
							if (reso.data.chartNumber != null && typeof reso.data.chartNumber != 'undefined') {
							console.log(reso);
								// 预览图片
								uni.navigateTo({
									url: '/pages/component/warehouse/documentEnquiry?chartNumber=' + reso.data.chartNumber
								});
							} else {
								uni.showToast({
									icon: 'none',
									title: '该二维码没有图号'
								});
							}
						})
						.catch(err => {
							uni.showToast({
								icon: 'none',
								title: err.msg
							})
						})
				}
			})
		}
	}
};
</script>

<style>
.page {
	height: 100vh;
}
.nav-list {
	margin-top: 5%;
}
.cu-bar {
	height: 50px;
}
.nav-title::first-letter {
	font-size: 16px;
	margin-right: 2px;
}
</style>
