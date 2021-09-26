<template>
	<view>
		<loading :loadModal="loadModal"></loading>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">汇报</block>
		</cu-custom>
		<!-- <uni-fab
	    :pattern="pattern"
	    :horizontal="horizontal"
		:vertical="vertical"
		cuIcon="add"
		:popMenu="popMenu"
		distable
		:direction="direction"
		 @fabClick="fabClick"
		 ></uni-fab> -->
		<view class="box getheight">
			<!-- <view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
			<view class="action">
				单号:<text>{{form.workNo}}</text>
			</view>
			<view class="action">
				卡号:<text>{{form.processCard}}</text>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
			<view class="action">
				金蝶号:<text>{{form.kingDeeNo}}</text>
			</view>
			<view class="action">
				生产批次:<text>{{form.lotNo}}</text>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
			<view class="action">
				产品编码:<text>{{form.productName}}</text>
			</view>
			<view class="action">
				产品名称:<text>{{form.productNumber}}</text>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
			<view class="action">
				规格型号:<text>{{form.model}}</text>
			</view>
			<view class="action">
				计划量:<text>{{form.planNum}}</text>
			</view>
		</view><view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
			<view class="action">
				派工数量:<text>{{form.dispatchNum}}</text>
			</view>
			
		</view> -->
		</view>
		<view class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
			<view class="cu-dialog" style="height: 70%;margin-top: 20%;">
				<view class="cu-bar bg-white justify-end" style="height: 60upx;">
					<view class="content">人员信息</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view style="height: 100%;overflow: auto;text-align: left;">
					<city-select @cityClick="cityClick" :formatName="formatName" :obtainCitys="empList" :isSearch="true" style="width: auto !important;" ref="citys"></city-select>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item, index) in cuIList" :key="index">
				<view class="cu-list menu-avatar">
					<view
						class="cu-item"
						style="width: 100%;height: 320upx;"
						:class="modalName == 'move-box-' + index ? 'move-cur' : ''"
						@touchstart="ListTouchStart"
						@touchmove="ListTouchMove"
						@touchend="ListTouchEnd"
						:data-target="'move-box-' + index"
					>
						<view style="clear: both;width: 100%;" class="grid text-center  col-2" data-number="item.number">
							<!-- <view style="width: 100%;">
								<view class="text-grey">
									<button class="cu-btn sm round bg-green shadow" @tap="showModal(index, item)" :disabled="isDis" data-target="Modal">
									<text class="cuIcon-people">
									</text>人员:{{item.userName}}</button>
								</view>
							</view> -->
							<view class="text-grey">单号:{{ item.workNo }}</view>
							<view class="text-grey">卡号:{{ item.processCard }}</view>
							<view class="text-grey">金蝶号:{{ item.kingDeeNo }}</view>
							<view class="text-grey">生产批次:{{ item.lotNo }}</view>
							<view class="text-grey">产品编码:{{ item.productNumber }}</view>
							<view class="text-grey">产品名称:{{ item.productName }}</view>
							<view class="text-grey">规格型号:{{ item.model }}</view>
							<view class="text-grey">计划量:{{ item.planNum }}</view>
							<view class="text-grey">派工量:{{ item.dispatchNum }}</view>
							<view class="text-grey">人员:{{ item.dispatchName }}</view>
							<view>
								<view style="float: left;line-height: 70upx;">生产数量:</view>
								<input name="input" type="digit" @input="checkBlur1($event,item)" style="border-bottom: 1px solid;" v-model="item.productNum" />
							</view>
							<view>
								<view style="float: left;line-height: 70upx;">合格数量:</view>
								<input name="input" type="digit" @input="checkBlur2($event,item)" style="border-bottom: 1px solid;" v-model="item.qualifiedNum" />
							</view>
						</view>
						<view class="move"><view class="bg-red" @tap="del(index, item)">删除</view></view>
					</view>
				</view>
			</view>
			<view class="cu-bar tabbar shadow foot">
				<view class="box text-center">
					<button :disabled="isClick" class="cu-btn bg-green shadow-blur round lg" style="width: 40%;margin-right: 10%;" @tap="$manyCk(saveData)">提交</button>
					<!-- <button class="cu-btn bg-blue shadow-blur round lg" style="width: 40%;" @tap="$manyCk(clearList)">清空</button> -->
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
import ldSelect from '@/components/ld-select/ld-select.vue';
import uniFab from '@/components/uni-fab/uni-fab.vue';
import basic from '@/api/basic';
import workshop from '@/api/workshop';
import service from '@/service.js';
import loading from '@/components/loading';
export default {
	components: { ruiDatePicker, ldSelect, uniFab, loading },
	data() {
		return {
			formatName: 'FName',
			pageHeight: 0,
			headName: '',
			isOrder: false,
			loadModal: false,
			onoff: true,
			isClick: false,
			pickerVal: null,
			gridCol: 3,
			modalName: null,
			form: {
				dispatchNum: '',
				kingDeeNo: '',
				lotNo: '',
				model: '',
				planNum: '',
				processCard: '',
				productWorkDetailId: '',
				workNo: ''
			},
			skin: false,
			listTouchStart: 0,
			listTouchDirection: null,
			empList: [],
			horizontal: 'right',
			vertical: 'bottom',
			popMenu: false,
			direction: 'horizontal',
			pattern: {
				color: '#7A7E83',
				backgroundColor: '#fff',
				selectedColor: '#007AFF',
				buttonColor: '#007AFF'
			},
			cuIList: [{}],
			startDate: null,
			endDate: null
		};
	},
	onLoad: function(option) {
		let me = this;
		let list = JSON.parse(option.cutList);
		if (JSON.stringify(option) != '{}') {
			this.isOrder = true;
			this.cuIList = list;
			me.startDate = option.startDate;
			me.endDate = option.endDate;
			/* list.forEach((item,index) =>{
						 me.form.kingDeeNo = option.kingDeeNo
						  me.form.productWorkDetailId = option.productWorkDetailId 
						  me.form.lotNo = option.lotNo 
						  me.form.model = option.model 
						  me.form.planNum = option.planNum 
						  me.form.processCard = option.processCard 
						  me.form.productName = option.productName 
						  me.form.productNumber = option.productNumber 
						  me.form.workNo = option.workNo 
						 
					 }) */
		}
	},
	onReady: function() {
		var me = this;
		me.loadModal = true;
		if (service.getUsers().length > 0) {
			if (service.getUsers()[0].account != '' && service.getUsers()[0].account != 'undefined') {
				me.form.fbillerID = service.getUsers()[0].userId;
				me.form.username = service.getUsers()[0].username;
				uni.getSystemInfo({
					success: function(res) {
						// res - 各种参数
						let info = uni.createSelectorQuery().select('.getheight');
						let customHead = uni.createSelectorQuery().select('.customHead');
						var infoHeight = 0;
						var headHeight = 0;
						info.boundingClientRect(function(data) {
							//data - 各种参数
							infoHeight = data.height;
						}).exec();
						customHead
							.boundingClientRect(function(data) {
								//data - 各种参数
								headHeight = data.height;
							})
							.exec();
						setTimeout(function() {
							me.pageHeight = res.windowHeight - infoHeight - headHeight;
						}, 1000);
					}
				});
				me.initMain();
			}
		}
	},
	methods: {
		checkBlur1(event,item) {
			let me = this
			if (event.target.value > item['dispatchNum']) {
				me.$set(item, 'productNum', 0);
				me.$forceUpdate();   
				return uni.showToast({
					icon: 'none',
					title: '生产数量不能大于派工数量'
				});
			} else {
				if (event.target.value < item['qualifiedNum']) {
					me.$set(item, 'qualifiedNum', item['productNum']);
				}
			}
		},
		checkBlur2(event,item) {
			let me = this
			if (event.target.value > item['productNum']) {
				me.$set(item, 'qualifiedNum', 0);
				me.$forceUpdate();
				return uni.showToast({
					icon: 'none',
					title: '合格数量不能大于生产数量'
				});
			}
		},
		cityClick(item) {
			this.$set(this.popupForm, 'userName', item.FName);
			this.$set(this.popupForm, 'userId', item.FItemID);
			this.modalName = null;
		},
		showModal(index, item) {
			this.modalName = 'Modal';
			this.popupForm = item;
		},
		hideModal(e) {
			this.modalName = null;
		},
		clearList() {
			const that = this;
			if (that.cuIList.length > 0) {
				uni.showModal({
					title: '温馨提示',
					content: '是否清空列表，清空之后将无法还原！',
					success: function(res) {
						if (res.confirm) {
							that.cuIList = [];
							that.initMain();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		},
		initMain() {
			const me = this;
			this.form.fdate = this.getDay('', 0).date;
			basic
				.getEmpList({})
				.then(res => {
					if (res.success) {
						me.empList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			me.loadModal = false;
			me.isClick = false;
		},
		saveData() {
			this.isClick = true;
			let portData = {};
			let result = [];
			let list = this.cuIList;
			let array = [];
			let me = this;
			let isCheck = false;
			let isBatchNo = false;
			for (let i in list) {
				let obj = {};
				obj.productNum = list[i].productNum;
				obj.qualifiedNum = list[i].qualifiedNum;
				obj.dispatchId = list[i].dispatchId;
				/* obj.userId = list[i].userId */
				if (list[i].productNum > 0 && list[i].qualifiedNum > 0) {
					isCheck = true;
				} else {
					isCheck = false;
				}
				obj.productWorkDetailId = list[i].productWorkDetailId;
				array.push(obj);
			} 
			if (array.length > 0) {
				if (isCheck) {
					workshop
						.productWorkReportAdd(JSON.stringify(array))
						.then(res => {
							if (res.success) {
								this.cuIList = [];
								uni.showToast({
									icon: 'success',
									title: res.msg
								});
								this.form.bNum = 0;
								this.initMain();
								if (this.isOrder) {
									setTimeout(function() {
										uni.$emit('handleBack', { startDate: me.startDate, endDate: me.endDate });
										uni.navigateBack({
											url: '../workshop/report'
										});
									}, 1000);
								}
							}
						})
						.catch(err => {
							uni.showToast({
								icon: 'none',
								title: err.msg
							});
							this.isClick = false;
						});
				} else {
					uni.showToast({
						icon: 'none',
						title: '生产数量或合同数量不能等于零或空'
					});
				}
			} else {
				uni.showToast({
					icon: 'none',
					title: '请填写汇报'
				});
				this.isClick = false;
			}
		},
		del(index, item) {
			this.cuIList.splice(index, 1);
			this.form.bNum = this.cuIList.length;
		},
		// 查询前后三天日期
		getDay(date, day) {
			var today = new Date();
			var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
			today.setTime(targetday_milliseconds); //注意，这行是关键代码
			var tYear = today.getFullYear();
			var tMonth = today.getMonth();
			var tDate = today.getDate();
			var getDay = today.getDay();
			tMonth = this.doHandleMonth(tMonth + 1);
			tDate = this.doHandleMonth(tDate);
			var weeks = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
			var week = weeks[getDay];
			return {
				day: tDate,
				week: week,
				date: tYear + '-' + tMonth + '-' + tDate
			};
		},
		doHandleMonth(month) {
			var m = month;
			if (month.toString().length == 1) {
				m = '0' + month;
			}
			return m;
		},
		PickerChange(e, item) {
			this.$set(item, 'userName', this.empList[e.detail.value].FName);
			this.$set(item, 'userId', this.empList[e.detail.value].FItemID);
		},
		fabClick() {
			var that = this;
			that.cuIList.push({
				userId: null,
				dispatchNum: 0,
				qualifiedNum: 0
			});
		}, // ListTouch触摸开始
		ListTouchStart(e) {
			this.listTouchStart = e.touches[0].pageX;
		},

		// ListTouch计算方向
		ListTouchMove(e) {
			this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left';
		},

		// ListTouch计算滚动
		ListTouchEnd(e) {
			if (this.listTouchDirection == 'left') {
				this.modalName = e.currentTarget.dataset.target;
			} else {
				this.modalName = null;
			}
			this.listTouchDirection = null;
		}
	}
};
</script>

<style>
.cu-item {
	float: left;
	width: 50%;
}
.cu-item .content {
	float: left;
}
.cu-list.menu-avatar > .cu-item .content {
	left: 5px;
}
.cu-list.menu-avatar > .cu-item .action {
}
.input {
	height: 30px;
}
.box {
	width: 100%;
}
.uni-input-placeholder,
.uni-input-input {
	font-size: 13px;
}
.action,
.content {
	font-size: 13px !important;
}
.ruidata {
	font-size: 13px;
	height: 7vw !important;
}
.cu-bar {
	min-height: 30px;
}
/* .page {
		height: calc(100vh - 320upx);
	} */
.nav-title::first-letter {
	font-size: 16px;
	margin-right: 2px;
}
</style>
