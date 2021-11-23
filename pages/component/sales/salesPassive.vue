<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">销售出库</block>
		</cu-custom>
		<loading :loadModal="loadModal"></loading>
		<!-- <uni-fab :pattern="pattern" :horizontal="horizontal" :vertical="vertical" :popMenu="popMenu" distable :direction="direction" @fabClick="fabClick"></uni-fab> -->
		<view class="box getheight">
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					单号:
					<text>{{ form.finBillNo }}</text>
				</view>
				<view class="action">
					日期:
					<ruiDatePicker fields="day" class="ruidata" start="2010-00-00" end="2030-12-30" :value="form.fdate" @change="bindChange"></ruiDatePicker>
				</view>
				<view class="action">
					包数:
					<text>{{ form.bNum }}</text>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view style="width: 90px;">部门:</view>
					<ld-select :list="deptList" list-key="FName" value-key="FNumber" placeholder="请选择" clearable v-model="form.fdeptID" @change="deptChange"></ld-select>
				</view>
				<view class="action">
					<view style="width: 90px;">仓库:</view>
					<ld-select :list="stockList" list-key="FName" value-key="FNumber" placeholder="请选择" clearable v-model="form.fdCStockId" @change="stockChange"></ld-select>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view class="title">客户:{{ form.FCustName }}</view>
					<!-- <ld-select :list="customerList"
				list-key="FName" value-key="FNumber"
				placeholder="请选择"
				clearable
				
				:value="form.FCustNumber"
				@change="customerChange"></ld-select> -->
				</view>
				<button class="cu-btn round lines-blue line-blue shadow" @tap="showModal" :disabled="isDis" data-target="Modal">选择</button>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view class="title">备注:</view>
					<input name="input" style="font-size: 13px;text-align: left;" v-model="form.fnote" />
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
			<view class="cu-dialog" style="height: 70%;margin-top: 20%;">
				<view class="cu-bar bg-white justify-end" style="height: 60upx;">
					<view class="content">客户信息</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view style="width:100%;height: 100%;overflow: auto;text-align: left;">
					<city-select
						@cityClick="cityClick"
						:formatName="formatName"
						:obtainCitys="customerList"
						:isSearch="true"
						style="width: auto !important;"
						ref="citys"
					></city-select>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item, index) in cuIList" :key="index">
				<view class="cu-list menu-avatar">
					<view class="cu-item" style="width: 100%;margin-top: 2px;height: 220upx;" :data-target="'move-box-' + index">
						<view style="clear: both;width: 100%;" class="grid text-center col-2" data-target="Modal" data-number="item.number">
							<view class="text-grey">序号:{{ (item.index = index + 1) }}</view>
							<view class="text-grey">编码:{{ item.number }}</view>
							<view class="text-grey">名称:{{ item.name }}</view>
							<view class="text-grey">数量:{{ item.quantity }}</view>
							<view class="text-grey">批号:{{ item.fbatchNo }}</view>
							<view class="text-grey">单位:{{ item.unitName }}</view>
							<view class="text-grey">规格:{{ item.model }}</view>
							<view class="text-grey"></view>
							<view class="text-grey">{{ item.stockName }}</view>
							<view class="text-grey">
								<picker @change="PickerChange($event, item)" :value="pickerVal" :range-key="'FName'"
									:range="stockList">
									<view class="picker">
										<button class="cu-btn sm round bg-green shadow">
											<text class="cuIcon-homefill"></text>
											仓库
										</button>
									</view>
								</picker>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-bar tabbar shadow foot">
				<view class="box text-center">
					<button class="cu-btn bg-green shadow-blur round lg" style="width: 40%;" :disabled="isClick" @tap="$manyCk(saveData)">提交</button>
					<button v-if="!isOrder" class="cu-btn bg-blue shadow-blur round lg" style="width: 40%;" @tap="$manyCk(clearList)">清空</button>
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
import sales from '@/api/sales';
import citySelect from '@/components/city-select/city-select.vue';
import loading from '@/components/loading';
import service from '@/service.js';
export default {
	components: { ruiDatePicker, ldSelect, uniFab, loading, citySelect },
	data() {
		return {
			formatName: 'FName',
			pageHeight: 0,
			headName: '',
			isOrder: false,
			isClick: false,
			onoff: true,
			isDis: false,
			loadModal: false,
			pickerVal: null,
			modalName: null,
			gridCol: 3,
			form: {
				finBillNo: null,
				fdate: '',
				bNum: 0,
				fnote: '',
				FCustNumber: '',
				fbillerID: null,
				fdCStockId: '',
				FCustName: '',
				fdeptID: ''
			},

			skin: false,
			listTouchStart: 0,
			listTouchDirection: null,
			deptList: [],
			stockList: [],
			customerList: [],
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
			cuIList: [],
			dataList: [],
			startDate: null,
			endDate: null,
			billNo: null
		};
	},
	onLoad: function(option) {
		let me = this;
		uni.$on('scancodedate', function(data) {
			// _this 这里面的方法用这个 _this.code(data.code)
			me.getScanInfo(data.code);
		});
		if (JSON.stringify(option) != '{}') {
			this.isOrder = true;
			this.isDis = true;
			me.form.fdeptID = option.FDeptNumber;
			me.form.FCustNumber = option.FCustNumber;
			me.form.FCustName = option.FCustName;
			me.startDate = option.startDate;
			me.endDate = option.endDate;
			me.billNo = option.billNo;
			basic
				.getOrderList({
					billNo: option.billNo,
					tranType: option.tranType,
					type: option.type
				})
				.then(res => {
					if (res.success) {
						let data = res.data.list;
						console.log(data)
						for (let i in data) {
							me.dataList.push({
								Fdate: data[i].Fdate,
								number: data[i].FItemNumber,
								name: data[i].FItemName,
								model: data[i].FModel,
								FBatchManager: data[i].FBatchManager,
								fsourceBillNo: data[i].FBillNo,
								Famount: data[i].Famount,
								onFBarCode: [],
								FOrderEntryID: data[i].FOrderEntryID,
								ForderID: data[i].ForderID,
								FPrdBillNo: data[i].FPrdBillNo,
								FBarCode: data[i].FBarCode,
								Fauxprice: data[i].Fauxprice,
								fsourceEntryId: data[i].FEntryID,
								fsourceTranType: data[i].FTranType,
								quantity: data[i].Fauxqty,
								unitID: data[i].FUnitNumber,
								unitName: data[i].FUnitName
							});
						}
						/* me.form.bNum = res.data.list.length; */
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		}
	},
	onUnload() {
		// 移除监听事件
		uni.$off('scancodedate');
	},
	onReady: function() {
		var me = this;
		me.loadModal = true;
		me.initMain();
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
			}
		}
	},
	methods: {
		cityClick(item) {
			this.form.FCustName = item.FName;
			this.form.FCustNumber = item.FNumber;
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
				.getBillNo({ TranType: 21 })
				.then(res => {
					if (res.success) {
						me.form.finBillNo = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			basic
				.getDeptList({})
				.then(res => {
					if (res.success) {
						me.deptList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			basic
				.getStockList({})
				.then(res => {
					if (res.success) {
						me.stockList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			basic
				.customerList({})
				.then(res => {
					if (res.success) {
						me.customerList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			me.isClick = false;
			me.loadModal = false;
		},
		saveData() {
			this.isClick = true;
			let portData = {};
			let result = [];
			let list = this.cuIList;
			let array = [];
			let isBatchNo = false;
			for (let i in list) {
				let obj = {};
				obj.fauxqty = list[i].quantity;
				obj.fentryId = list[i].index;
				obj.finBillNo = list[i].FBillNo;
				/* if (list[i].FBatchManager) {
					if (list[i].fbatchNo != '' && list[i].fbatchNo != null) {
						obj.fbatchNo = list[i].fbatchNo;
						isBatchNo = true;
					} else {
						isBatchNo = false;
						break;
					}
				} else {
					if (list[i].fbatchNo == '' || list[i].fbatchNo == null) {
						obj.fbatchNo = list[i].fbatchNo;
						isBatchNo = true;
					} else {
						isBatchNo = false;
						break;
					}
				} */
				obj.fitemId = list[i].number;
				obj.fauxprice = list[i].Fauxprice != null && typeof list[i].Fauxprice != 'undefined' ? list[i].Fauxprice : 0;
				obj.famount = list[i].Famount != null && typeof list[i].Famount != 'undefined' ? list[i].Famount : 0;
				obj.fdCStockId = list[i].stockId;
				/* if (list[i].stockId == null || typeof list[i].stockId == 'undefined') {
					result.push(list[i].index);
				} */
				if (list[i].quantity == null || list[i].quantity == 0 || typeof list[i].quantity == '') {
					result.push(list[i].index);
				}
				obj.fsourceBillNo = list[i].fsourceBillNo == null || list[i].fsourceBillNo == 'undefined' ? '' : list[i].fsourceBillNo;
				obj.fsourceEntryId = list[i].fsourceEntryId == null || list[i].fsourceEntryId == 'undefined' ? '' : list[i].fsourceEntryId;
				obj.fsourceTranType = list[i].fsourceTranType == null || list[i].fsourceTranType == 'undefined' ? '' : list[i].fsourceTranType;
				obj.funitId = list[i].unitID;
				array.push(obj);
			}
			portData.items = array;
			portData.ftranType = 21;
			portData.finBillNo = this.form.finBillNo;
			portData.fdate = this.form.fdate;
			portData.fbillerID = this.form.fbillerID;
			portData.fdeptId = this.form.fdeptID;
			portData.fcustId = this.form.FCustNumber;
			portData.fsupplyID = this.form.FCustNumber;
			if (this.form.FCustNumber == '' || typeof this.form.FCustNumber == 'undefined') {
				uni.showToast({
					icon: 'none',
					title: '客户不能为空'
				});
				this.isClick = false;
				return;
			}
			/* console.log(JSON.stringify(portData)) */
			if (result.length == 0) {
				if (portData.fcustId != '' && typeof portData.fcustId != 'undefined') {
					/* if (isBatchNo) { */
						sales
							.saleStockOut(portData)
							.then(res => {
								console.log(res)
								if (res.success) {
									this.cuIList = [];
									uni.showToast({
										icon: 'success',
										title: res.msg
									});
									this.form.bNum = 0;
									this.initMain();
									if (this.isOrder) {
										uni.navigateBack({
											url: '../sales/salesActive?startDate=' + this.startDate + '&endDate=' + this.endDate
										});
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
					/* } else {
						uni.showToast({
							icon: 'none',
							title: '启用批号，批号不能为空，未启用批号，批号必须为空'
						});
						this.isClick = false;
					} */
				} else {
					uni.showToast({
						icon: 'none',
						title: '客户不能为空'
					});
					this.isClick = false;
				}
			} else {
				uni.showToast({
					icon: 'none',
					title: '物料实发数量不允许为空'
				});
				this.isClick = false;
			}
		},
		del(index, item) {
			this.cuIList.splice(index, 1);
			this.form.bNum = this.cuIList.length;
		},
		showModal(e) {
			this.modalName = e.currentTarget.dataset.target;
		},
		hideModal(e) {
			this.modalName = null;
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
		deptChange(val) {
			this.form.fdeptID = val;
		},
		customerChange(val) {
			this.form.FCustNumber = val;
		},
		stockChange(val) {
			let sList = this.stockList;
			let list = this.cuIList;
			const me = this;
			for (let i in sList) {
				if (sList[i].FNumber == val) {
					for (let j in list) {
						me.$set(list[j], 'stockName', sList[i].FName);
						me.$set(list[j], 'stockId', val);
					}
				}
			}
		},
		bindChange(e) {
			this.form.fdate = e;
		},
		PickerChange(e, item) {
			this.$set(item, 'stockName', this.stockList[e.detail.value].FName);
			this.$set(item, 'stockId', this.stockList[e.detail.value].FNumber);
		},
		fabClick() {
			var that = this;
			let number = 0;
			uni.scanCode({
				success: function(res) {
					that.getScanInfo(res.result);
				}
			});
		},
		getScanInfo(res) {
			var that = this;
			let number = 0;
			if (that.isOrder) {
				let resData = res.split(',')
				for (let i in that.dataList) {
					console.log(resData)
					console.log(that.dataList[i])
					//判断是否属于单据物料
					if(resData[0] == that.dataList[i]['FPrdBillNo'] && resData[7] == that.dataList[i]['number']&& resData[8] == that.dataList[i]['model']){
						//判断已插入表数据，长度为0 则不用检验条码是否重复
						if(that.cuIList.length>0){
							if (that.dataList[i]['onFBarCode'].indexOf(res) ==-1) {
								that.dataList[i]['onFBarCode'].push(res)
								that.cuIList.push({
									Fdate: that.dataList[i].Fdate,
									number: that.dataList[i].number,
									name: that.dataList[i].name,
									model: that.dataList[i].model,
									FBatchManager: that.dataList[i].FBatchManager,
									fsourceBillNo: that.dataList[i].fsourceBillNo,
									Famount: that.dataList[i].Famount,
									onFBarCode: res,
									FBarCode: res,
									bNum: resData[3],
									FOrderEntryID: that.dataList[i].FOrderEntryID,
									ForderID: that.dataList[i].ForderID,
									FPrdBillNo: that.dataList[i].FPrdBillNo,
									FBarCode: that.dataList[i].FBarCode,
									Fauxprice: that.dataList[i].Fauxprice,
									fsourceEntryId: that.dataList[i].fsourceEntryId,
									fsourceTranType: that.dataList[i].fsourceTranType,
									quantity: resData[2],
									unitID: that.dataList[i].unitID,
									unitName: that.dataList[i].unitName
								});
								that.form.bNum += parseFloat(resData[3]);
							}else{
								uni.showToast({
									icon: 'none',
									title: '该条码已扫描！'
								});
								break;
							}
						}else{
							that.dataList[i]['onFBarCode'].push(res)
							that.cuIList.push({
								Fdate: that.dataList[i].Fdate,
								number: that.dataList[i].number,
								name: that.dataList[i].name,
								model: that.dataList[i].model,
								FBatchManager: that.dataList[i].FBatchManager,
								fsourceBillNo: that.dataList[i].fsourceBillNo,
								Famount: that.dataList[i].Famount,
								onFBarCode: res,
								FBarCode: res,
								bNum: resData[3],
								FOrderEntryID: that.dataList[i].FOrderEntryID,
								ForderID: that.dataList[i].ForderID,
								FPrdBillNo: that.dataList[i].FPrdBillNo,
								FBarCode: that.dataList[i].FBarCode,
								Fauxprice: that.dataList[i].Fauxprice,
								fsourceEntryId: that.dataList[i].fsourceEntryId,
								fsourceTranType: that.dataList[i].fsourceTranType,
								quantity: resData[2],
								unitID: that.dataList[i].unitID,
								unitName: that.dataList[i].unitName
							});
							that.form.bNum += parseFloat(resData[3]);
						}
					} else {
						number ++;
					}
				}
				if(number == that.dataList.length){
					uni.showToast({
						icon: 'none',
						title: '该物料不在所选单据中！'
					});
				}
			}
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
