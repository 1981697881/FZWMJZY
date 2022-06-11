<template>
	<view>
		<loading :loadModal="loadModal"></loading>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">领料</block>
		</cu-custom>
		<!-- <uni-fab v-if="!isOrder" :pattern="pattern" :horizontal="horizontal" :vertical="vertical" :popMenu="popMenu" distable :direction="direction" @fabClick="fabClick"></uni-fab>
		<zhilin-picker v-model="show" :data="chooseList" :title="title" @confirm="chooseClick" /> -->
		<view class="box getheight">
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					单号:
					<text>{{ form.finBillNo }}</text>
				</view>
				<view class="action">
					日期:
					<ruiDatePicker fields="day" class="ruidata" start="2010-00-00" end="2030-12-30" :value="form.fdate"
						@change="bindChange"></ruiDatePicker>
				</view>
				<view class="action">
					包数:
					<text>{{ form.bNum }}</text>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view style="width: 90px;">部门:</view>
					<ld-select :list="deptList" list-key="FName" value-key="FNumber" placeholder="请选择" clearable
						v-model="form.fdeptID" @change="deptChange"></ld-select>
				</view>
				<!-- <view class="action">
					<view style="width: 90px;">仓库:</view>
					<ld-select :list="stockList" disabled list-key="FName" value-key="FNumber" placeholder="请选择"
						clearable v-model="form.fdCStockId" @change="stockChange"></ld-select>
				</view> -->
				<!-- <view class="action">
					<view style="width: 90px;">类别:</view>
					<ld-select :list="typeList" list-key="FName"  value-key="FNumber" placeholder="请选择" clearable
						v-model="form.FLevel" @change="typeChange"></ld-select>
				</view> -->
				<view class="action">
					<view style="width: 120px;">领料人:</view>
					<ld-select :list="empList" list-key="FName" value-key="FNumber" placeholder="请选择" clearable
						v-model="form.fsManagerID" @change="empChange"></ld-select>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view class="title">备注:</view>
					<input name="input" style="font-size: 13px;text-align: left;" v-model="form.fnote" />
				</view>
				<button class="cu-btn round lines-blue line-blue shadow" @tap="showModal"
					data-target="Modal">详情</button>
			</view>
		</view>
		<view class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
			<view class="cu-dialog" style="height: 350upx;">
				<view class="cu-bar bg-white justify-end" style="height: 60upx;">
					<view class="content">温馨提示</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="padding-sm">
					<view class="cu-item">
						<view class="content">
							<text class="text-grey">用户：{{ form.username }}</text>
						</view>
						<view class="action"><text class="text-grey"></text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName2 == 'Modal' ? 'show' : ''">
			<view class="cu-dialog" style="height: auto;">
				<view class="cu-bar bg-white justify-end" style="height: 60upx;">
					<view class="content">{{ popupForm.headName }}</view>
					<view class="action" @tap="hideModal2"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view>
					<view class="cu-item" style="width: 100%;">
						<view class="flex">
							<view class="flex-sub">
								<view class="cu-form-group">
									<view class="title">数量:</view>
									<input name="input" type="digit" style="border-bottom: 1px solid;" v-model="popupForm.quantity" />
								</view>
							</view>
						</view>
					</view>
					<view class="cu-item" style="width: 100%;height: auto;">
						<view class="flex">
							<view class="flex-sub">
								<view class="cu-form-group">
									<view class="title">库存数:{{inPosition}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="clear: both;" class="cu-bar bg-white justify-end padding-bottom-xl">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal2">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="$manyCk(saveCom)">确定</button>
					</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item, index) in cuIList" :key="index">
				<view class="cu-list menu-avatar">
					<view class="cu-item" style="width: 100%;margin-top: 2px;height: 260upx;"
						:class="modalName == 'move-box-' + index ? 'move-cur' : ''" @touchstart="ListTouchStart"
						@touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
						<view style="clear: both;width: 100%;" @tap="showModal2(index, item)" class="grid text-center col-2" data-target="Modal"
							data-number="item.number">
							<view class="text-grey">序号:{{ (item.index = index + 1) }}</view>
							<view class="text-grey">编码:{{ item.number }}</view>
							<view class="text-grey">名称:{{ item.name }}</view>
							<view class="text-grey">数量:{{ item.quantity }}</view>
							<view class="text-grey">批号:{{ item.fbatchNo }}</view>
							<view class="text-grey">单位:{{ item.unitName }}</view>
							<view class="text-grey">规格:{{ item.model }}</view>
							<view class="text-grey">仓位:{{ item.positions }}</view>
							<view class="text-grey">板号:{{ item.edition }}</view>
							<view class="text-grey">{{ item.stockName }}</view>
							<view class="text-grey text-center">
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
						<view class="move">
							<view class="bg-red" @tap="del(index, item)">删除</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-bar tabbar shadow foot">
				<view class="box text-center">
					<button :disabled="isClick" class="cu-btn bg-green shadow-blur round lg"
						style="width: 40%;margin-right: 10%;" @tap="$manyCk(saveData)">提交</button>
					<button class="cu-btn bg-blue shadow-blur round lg" style="width: 40%;"
						@tap="$manyCk(clearList)">清空</button>
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
	import production from '@/api/production';
	import service from '@/service.js';
	import loading from '@/components/loading';
	import selectTree from '@/components/select-tree/select-tree';
	import zhilinPicker from '@/components/zhilin-picker/zhilin-picker.vue';
	export default {
		components: {
			zhilinPicker,
			selectTree,
			ruiDatePicker,
			ldSelect,
			uniFab,
			loading
		},
		props: {
			showCheck: {
				//显示多选框
				type: Boolean,
				default: true
			},
			disableLv2Check: {
				//让二级标题不可选中
				type: Boolean,
				default: false
			},
			showDelete: {
				//显示删除按钮
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				finalList: [],
				menuKey: 1,
				show: false,
				title: '选择库存',
				pageHeight: 0,
				headName: '',
				isOrder: false,
				onoff: true,
				isClick: false,
				loadModal: false,
				pickerVal: null,
				modalName: null,
				modalName2: null,
				gridCol: 3,
				form: {
					finBillNo: null,
					fdate: '2020-01-01',
					bNum: 0,
					fnote: '',
					fsManagerID: '',
					fbillerID: null,
					fdCStockId: '',
					fdeptID: '',
					FLevel: ''
				},
				borrowItem: {},
				popupForm: {
					quantity: ''
				},
				skin: false,
				inPosition: null,
				listTouchStart: 0,
				listTouchDirection: null,
				deptList: [],
				chooseList: [],
				empList: [],
				stockList: [],
				typeList: [],
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
				startDate: null,
				endDate: null
			};
		},
		onLoad: function(option) {
			let me = this;
			me.loadModal = true;
			uni.$on('scancodedate', function(data) {
				// _this 这里面的方法用这个 _this.code(data.code)
				me.getScanInfo(data.code);
			});
			me.initMain();
			if (JSON.stringify(option) != '{}') {
				this.isOrder = true;
				me.form.fdeptID = option.FDeptNumber;
				this.startDate = option.startDate;
				this.endDate = option.endDate;
				this.billNo = option.billNo;
				this.source = option.tranType;
				basic
					.getOrderList({
						billNo: option.billNo,
						tranType: option.tranType,
						type: option.type
					})
					.then(res => {
						if (res.success) {
							let data = res.data.list;
							console.log(data);
							for (let i in data) {
								me.cuIList.push({
									Fdate: data[i].Fdate,
									number: data[i].FItemNumber,
									name: data[i].FItemName,
									model: data[i].FModel,
									checked: false,
									show: false,
									isLoading: false,
									FCounty: 0,
									childrenList: [],
									Fauxprice: data[i].Fauxprice,
									Famount: data[i].Famount,
									FBatchManager: data[i].FBatchManager,
									fsourceBillNo: data[i].FBillNo,
									fsourceEntryID: data[i].FEntryID,
									quantity: data[i].Fauxqty,
									Fauxqty: data[i].Fauxqty,
									fsourceTranType: data[i].FTranType,
									unitID: data[i].FUnitNumber,
									unitName: data[i].FUnitName,
									stockName: me.stockList[0].FName,
									stockId: me.stockList[0].FNumber,
								});
							}
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
		onReady: function() {
			var me = this;
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
								me.pageHeight = res.windowHeight - infoHeight - headHeight - 30;
							}, 1000);
						}
					});
				}
			}
		},
		onUnload() {
			// 移除监听事件
			uni.$off('scancodedate');
		},
		methods: {
			submitCom(){
				var me = this;
				me.borrowItem.quantity = me.popupForm.quantity
				me.modalName2 = null 
			},
			saveCom() {
				var me = this;
				if (this.popupForm.quantity > me.borrowItem.quantity) {
					/* return uni.showToast({
						icon: 'none',
						title: "领料数量不能大于扫码数量"
					}); */
					me.submitCom()
					/* uni.showModal({
						title: '温馨提示',
						content: '领料数量不能大于扫码数量！请确认！',
						success: function(res) {
							if (res.confirm) {
								me.submitCom()
							} else if (res.cancel) {
								return
							}
						}
					}); */
				} else {
					me.submitCom()
				}
				
			},
			showModal2(index, item) {
				this.modalName2 = 'Modal';
				if (item.quantity == null || typeof item.quantity == 'undefined') {
					item.quantity = '';
				}
				this.popupForm = {
					quantity: item.quantity,
				};
				this.borrowItem = item;
				basic
					.inventoryByBarcode({
						uuid:  item.number+ "," +item.fbatchNo
					})
					.then(reso => {
						if (reso.success) {
							console.log(reso);
							let str = 0
							reso.data.forEach((resItem)=>{
								/* str +=resItem.FStockPlacename+'('+resItem.FQty+')'+',' */
								str +=Number(resItem.FQty)
							})
							this.inPosition = str
						}
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.msg
						});
					});
			},
			hideModal2(e) {
				this.modalName2 = null;
				this.popupForm = {};
			},
			deleteItem(item, index) {
				let me = this;
				uni.showModal({
					title: '温馨提示',
					content: '是否删除当前行,删除将无法复原？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							me.cuIList.splice(index, 1);
						}
					}
				});
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
					.getBillNo({
						TranType: 24
					})
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
					basic.getEmpList({}).then(res => {
						if(res.success){
							me.empList=res.data
						}
					}).catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.message,
						});
					});
				basic
					.getDeptList({})
					.then(res => {
						if (res.success) {
							me.deptList = res.data;
							me.form.fdeptID = res.data[4].FNumber;
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
				production
					.getItemList({
						parentNumber: 'YL.',
						isDetail: 0,
						level: 2,
						pageNum: 1,
						pageSize: 100
					})
					.then(res => {
						console.log(res)
						if (res.success) {
							me.typeList = res.data
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
				let isBatchNo = false;
				let batchMsg = '';
				list.forEach((item, index) => {
					let obj = {};
					obj.fauxqty = item.quantity;
					obj.fentryId = index + 1;
					obj.finBillNo = item.FBillNo;
					obj.fbatchNo = item.fbatchNo;
					/* if (list[i].FBatchManager) {
							if (list[i].fbatchNo != '' && list[i].fbatchNo != null) {
								obj.fbatchNo = list[i].fbatchNo;
								isBatchNo = true;
							} else {
								isBatchNo = false;
								batchMsg = '批号已启用，不允许为空';
								break;
							}
						} else {
							if (list[i].fbatchNo == '' || list[i].fbatchNo == null) {
								obj.fbatchNo = list[i].fbatchNo;
								isBatchNo = true;
							} else {
								batchMsg = '批号未启用，不允许输入';
								isBatchNo = false;
								break;
							}
						} */
					obj.fitemId = item.number;
					obj.fpackNum = item.bNum;
					obj.fdCSPId = item.FStockPlacename;
					obj.fauxprice = item.Fauxprice != null && typeof item.Fauxprice != 'undefined' ? item
						.Fauxprice : 0;
					obj.famount = item.Famount != null && typeof item.Famount != 'undefined' ? item.Famount : 0;
					obj.fsCStockId = item.stockId;
					if (item.stockId == null || typeof item.stockId == 'undefined') {
						result.push(item.index);
					}
					obj.fsourceBillNo = item.fsourceBillNo == null || item.fsourceBillNo == 'undefined' ? null :
						item.fsourceBillNo;
					obj.fsourceEntryId = item.fsourceEntryID == null || item.fsourceEntryID == 'undefined' ? null :
						item.fsourceEntryID;
					obj.fsourceTranType = item.fsourceTranType == null || item.fsourceTranType == 'undefined' ?
						null : item.fsourceTranType;
					obj.funitId = item.FUnitID;
					array.push(obj);
				});
				portData.items = array;
				portData.ftranType = 24;
				portData.finBillNo = this.form.finBillNo;
				portData.fdate = this.form.fdate;
				portData.fdeptId = this.form.fdeptID;
				portData.fbillerID = this.form.fbillerID;
				portData.fsManagerID = this.form.fsManagerID;
				if (this.form.fsManagerID == '' || typeof this.form.fsManagerID == 'undefined') {
					uni.showToast({
						icon: 'none',
						title: '领料人不能为空'
					});
					this.isClick = false;
					return;
				}
				console.log(JSON.stringify(portData));
				if (result.length == 0) {
					/*if (isBatchNo) { */
					production
						.pickingStockOut(portData)
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
										uni.$emit('handleBack', {
											startDate: me.startDate,
											endDate: me.endDate,
											source: me.source
										});
										uni.navigateBack({
											url: '../production/receiveActive'
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
					/* } else {
							uni.showToast({
								icon: 'none',
								title: batchMsg
							});
							this.isClick = false;
						}*/
				} else {
					uni.showToast({
						icon: 'none',
						title: '仓库不允许为空'
					});
					this.isClick = false;
				}
			},
			del(index, item) {
				let that = this;
				that.cuIList.splice(index, 1);
				let number = 0;
				that.form.bNum = 0;
				that.cuIList.forEach((item) => {
					that.form.bNum += Number(item.bNum);
				})
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
			empChange(val) {
				this.form.fsManagerID = val;
			},
			typeChange(val) {
				this.form.FLevel = val;
			},
			stockChange(val) {
				let sList = this.stockList;
				let list = this.cuIList;
				const me = this;
				for (let i in sList) {
					if (sList[i].FNumber == val) {
						for (let j in list) {
							me.$set(list[j], 'stockName', sList[i].FName);
							me.$set(list[j], 'FIsStockMgr', sList[i].FIsStockMgr);
							me.$set(list[j], 'stockId', val);
							me.$set(list[j], 'positions', '');
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
				this.$set(item, 'positions', '');
				this.$set(item, 'FIsStockMgr', this.stockList[e.detail.value].FIsStockMgr);
			},
			// 调用摄像头扫描
			fabClick() {
				var that = this;
				let number = 0;
				uni.scanCode({
					success: function(res) {
						that.getScanInfo(res.result);
					}
				});
			},
			// 扫码解析
			getScanInfo(res) {
				var that = this;
				let number = 0;
				//判断是否选择类别
				//if (that.form.FLevel) {
				// 判断无源单
				if (!that.isOrder) {
					let resData = res.split(',');
					// 判断类型是否一致
					//if (resData[0].substring(0, that.form.FLevel.length) == that.form.FLevel) {
					for (let i in that.cuIList) {
						if (resData[0] == that.cuIList[i]['number']) {
							if (that.cuIList[i]['onFBarCode'].indexOf(res) == -1) {
								if (that.cuIList[i]['fbatchNo'] == '') {
									that.cuIList[i]['quantity'] = resData[2];
									that.cuIList[i]['fbatchNo'] = resData[1];
									that.cuIList[i]['bNum'] = resData[3];
									that.cuIList[i]['onFBarCode'] = [res];
									that.cuIList[i]['edition'] = resData[4];
									that.cuIList[i]['stockName'] = that.stockList[0].FName;
									that.cuIList[i]['stockId'] = that.stockList[0].FNumber;
									that.form.bNum += parseFloat(resData[3]);
								} else {
									console.log(resData[1] == that.cuIList[i]['fbatchNo'] && that.cuIList[i]['edition'] !=
										resData[4])
									if (resData[1] == that.cuIList[i]['fbatchNo'] && that.cuIList[i]['edition'] != resData[
											4]) {
										that.cuIList[i]['quantity'] = parseFloat(that.cuIList[i]['quantity']) +
											parseFloat(
												resData[2]);
										that.cuIList[i]['bNum'] = parseFloat(that.cuIList[i]['bNum']) + parseFloat(
											resData[3]);
										that.cuIList[i]['onFBarCode'].push(res);
										that.form.bNum += parseFloat(resData[3]);
									} else {
										that.form.bNum += parseFloat(resData[3]);
										that.cuIList.push({
											number: that.cuIList[i]['number'],
											name: that.cuIList[i]['name'],
											model: that.cuIList[i]['model'],
											quantity: resData[2],
											bNum: resData[3],
											onFBarCode: [res],
											fbatchNo: resData[1],
											edition: resData[4],
											stockName: that.stockList[0].FName,
											stockId: that.stockList[0].FNumber,
											/* Fauxprice: that.cuIList[i]['Fauxprice'],
											Famount: that.cuIList[i]['Famount'],
											FBatchManager: that.cuIList[i]['FBatchManager'],
											fsourceBillNo: that.cuIList[i]['fsourceBillNo'],
											fsourceEntryID: that.cuIList[i]['fsourceEntryID'],
											Fauxqty: that.cuIList[i]['Fauxqty'],
											fsourceTranType: that.cuIList[i]['fsourceTranType'], */
											unitID: that.cuIList[i]['unitID'],
											unitName: that.cuIList[i]['unitName']
										});
									}
								}
								number++;
							} else {
								uni.showToast({
									icon: 'none',
									title: '该条码已扫描！'
								});
								number++;
								break;
							}
						}
					}
					if (number == 0) {
						console.log(resData);
						basic
							.getItemList({
								number: resData[0],
							})
							.then(reso => {
								console.log(reso);
								if (reso.success) {
									let data = reso.data.list;
									that.cuIList.push({
										number: data[0].FNumber,
										name: data[0].FName,
										model: data[0].FModel,
										/* Fauxprice: data[0].Fauxprice,
										Famount: data[0].Famount,
										FBatchManager: data[0].FBatchManager,
										fsourceBillNo: data[0].FBillNo,
										fsourceEntryID: data[0].FEntryID,
										fsourceTranType: data[0].FTranType, */
										quantity: resData[2],
										bNum: resData[3],
										onFBarCode: [res],
										edition: resData[4],
										fbatchNo: resData[1],
										stockName: that.stockList[0].FName,
										stockId: that.stockList[0].FNumber,
										unitID: data[0].FUnitNumber,
										unitName: data[0].FUnitName
									});
									that.form.bNum += parseFloat(resData[3]);
								}
							})
							.catch(err => {
								uni.showToast({
									icon: 'none',
									title: err.msg
								});
							});
					}
					/* } else {
						uni.showToast({
							icon: 'none',
							title: '选择类别和二维码类别不一致！'
						});
					} */
				} else {
					if (number == that.cuIList.length) {
						uni.showToast({
							icon: 'none',
							title: '该物料不在所选单据中！'
						});
					}
				}
				/* } else {
					uni.showToast({
						icon: 'none',
						title: '扫码前请选择类别！'
					});
				} */
			},
			// ListTouch触摸开始
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

	.cu-list.menu-avatar>.cu-item .content {
		left: 5px;
	}

	.cu-list.menu-avatar>.cu-item .action {}

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
<style lang="scss" scoped>
	/* #ifdef APP-PLUS*/
	.selectTrees {
		margin-bottom: 180rpx;
	}

	/* #endif */

	.deleteBtn {
		position: absolute;
		right: 10%;
		background: #f97979;
		padding: 2rpx 16rpx;
		border-radius: 4rpx;
	}

	.itemT:nth-child(odd) {
		margin-left: 60rpx;
		color: #666666;
		width: 45% !important;
	}

	.itemT:nth-child(even) {
		color: #666666;
		width: 40% !important;
	}

	.itemO {
		color: #666666;
		width: 50% !important;
	}

	.tree-two {
		padding: 20rpx;
		color: #666666;
		border-bottom: 2rpx solid #e2e2e2;
	}

	.flexIn {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
		flex-wrap: nowrap;
		width: 100%;
	}
</style>
