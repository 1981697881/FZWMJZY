<template>
	<view>
		<loading :loadModal="loadModal"></loading>
	<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true"><block slot="backText">返回</block><block slot="content">派工</block></cu-custom>
		<uni-fab
	    :pattern="pattern"
	    :horizontal="horizontal"
		:vertical="vertical"
		cuIcon="add"
		:popMenu="popMenu"
		distable
		:direction="direction"
		 @fabClick="fabClick"
		 ></uni-fab>
	<view class="box getheight">
		<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
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
				产品编码:<text>{{form.productNumber}}</text>
			</view>
			<view class="action">
				产品名称:<text>{{form.productName}}</text>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
			<view class="action">
				规格型号:<text>{{form.model}}</text>
			</view>
			<view class="action">
				计划量:<text>{{form.planNum}}</text>
			</view>
		</view>
	</view>
	<view class="cu-modal" :class="modalName=='Modal'?'show':''">
		<view class="cu-dialog" style="height: 70%;margin-top: 20%;">
			<view class="cu-bar bg-white justify-end" style="height: 60upx;">
				<view class="content">人员信息</view>
				<view class="action" @tap="hideModal">
					<text class="cuIcon-close text-red"></text>
				</view>
			</view>
			<view  style="height: 100%;overflow: auto;text-align: left;">
				 <city-select
				            @cityClick="cityClick"
				            :formatName="formatName"
				            :obtainCitys="empList"
				            :isSearch="true"
							style="width: auto !important;"
				            ref="citys"
				        ></city-select>
			</view>
		</view>
	</view>
	<scroll-view scroll-y class="page" :style="{ 'height': pageHeight + 'px' }">
		<view class="cu-bar bg-olive solid-bottom" style="height: 60upx;">
			<view class="action">
				<view style="width: 90px;">班组:</view>
				        <ld-select :list="deptList"
				        list-key="FName" value-key="FNumber"
				        placeholder="请选择"
				        clearable
				        v-model="form.fdeptID"
				        @change="deptChange"></ld-select>
			</view>
			<view class="action">
				<view style="width: 90px;">工序:</view>
				        <ld-select :list="processList"
				        list-key="FName" value-key="FNumber"
				        placeholder="请选择"
				        clearable
						
				        v-model="form.processID"
				        @change="processChange"></ld-select>
			</view>
		</view>
		<view class="cu-bar bg-olive solid-bottom" style="height: 60upx;">
			<view class="action">
				计划数量:<text>{{form.planNum}}</text>
			</view>
			<view class="action">
				开工日期:
				<ruiDatePicker
				    fields="day"
					class='ruidata'
				    start="2010-00-00"
				    end="2030-12-30"
					:value="form.workDate"
				    @change="bindChange"
				></ruiDatePicker>
			</view>
			<view class="action">
				合计:<text>{{form.bNum}}</text>
			</view>
		</view>
		<view v-for="(item,index) in cuIList" :key="index">
				<view class="cu-list menu-avatar">
					<view class="cu-item" style="width: 100%;margin-top: 2px;height: 80upx;"  :class="modalName=='move-box-'+ index?'move-cur':''" 
				 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index" >
							<view style="clear: both;width: 100%;" class="grid text-center col-2">
							<view>
								<view class="text-grey">
									<!-- <picker @change="PickerChange($event, item)" :value="pickerVal" :range-key="'FName'" :range="empList">
										<view class="picker">
											<button class="cu-btn sm round bg-green shadow" >
											<text class="cuIcon-people">
											</text>人员:{{item.userName}}</button>
										</view>
									</picker> -->
									<button class="cu-btn sm round bg-green shadow" @tap="showModal(index, item)" :disabled="isDis" data-target="Modal">
									<text class="cuIcon-people">
									</text>人员:{{item.userName}}</button>
								</view>
							</view>
							<view>
								<view style="float: left;line-height: 60upx;">派工量:</view>
								<input name="input" type="number" style="border-bottom: 1px solid;" @input='sumCount($event, item)' v-model="item.dispatchNum"/>
							</view>
							</view>
						<view class="move">
							<view class="bg-red" @tap="del(index,item)">删除</view>
						</view>
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
	 import ldSelect from '@/components/ld-select/ld-select.vue'
	 import uniFab from '@/components/uni-fab/uni-fab.vue';
	import basic from '@/api/basic';
	import citySelect from '@/components/city-select/city-select.vue';
	import workshop from '@/api/workshop';
	import service from '@/service.js';
	import loading from '@/components/loading';
	export default {
		 components: {ruiDatePicker, ldSelect, uniFab, loading, citySelect},
			data() {
				return {
					pageHeight: 0,
					headName: '',
					isOrder: false,
					isDis: false,
					onoff: true,
					isClick: false,
					loadModal: false,
					pickerVal: null,
					modalName: null,
					modalName2: null,
					gridCol: 3,
					formatName: 'FName',
					form: {
						kingDeeNo: '',
						lotNo: '',
						model: '',
						planNum: '',
						processCard: '',
						productName: '',
						productNumber: '',
						workNo: '',
						workDate: '',
						fdeptID: '',
						processID: '',
						bNum: 0,
					},
					popupForm:{},
					skin: false,
					listTouchStart: 0,
					listTouchDirection: null,
					deptList: [],
					empList: [],
					processList: [],
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
					endDate: null,	
				};
			},
			 onLoad: function (option) {
				 let me = this
				if(JSON.stringify(option) != "{}"){
					 this.isOrder = true
					 me.form.kingDeeNo = option.kingDeeNo 
					 me.form.productWorkDetailId = option.productWorkDetailId 
					 me.form.lotNo = option.lotNo 
					 me.form.model = option.model 
					 me.form.planNum = option.planNum 
					 me.form.processCard = option.processCard 
					 me.form.productName = option.productName 
					 me.form.productNumber = option.productNumber 
					 me.form.workNo = option.workNo 
					me.startDate = option.startDate
					me.endDate = option.endDate 
					 workshop.formatByProductWork({productWorkDetailId: option.productWorkDetailId}).then(res => {
					 	if(res.success){
					 		me.processList=res.data
					 	}
					 }).catch(err => {
					 	uni.showToast({
					 		icon: 'none',
					 		title: err.msg,
					 	});
					 })
				 }
			 },
		 onReady: function() {
			 var me = this
			 me.loadModal = true
			 if(service.getUsers().length > 0){
			 	if(service.getUsers()[0].account !='' && service.getUsers()[0].account != "undefined"){
					me.form.fbillerID = service.getUsers()[0].userId
					me.form.username = service.getUsers()[0].username
						uni.getSystemInfo({
						　　success: function(res) { // res - 各种参数
						　　   let info = uni.createSelectorQuery().select(".getheight");
						　　   let customHead = uni.createSelectorQuery().select(".customHead");
											 var infoHeight = 0;
											 var headHeight = 0;
						　　　  　info.boundingClientRect(function(data) { //data - 各种参数
												infoHeight = data.height
						　　    }).exec();
											customHead.boundingClientRect(function(data) { //data - 各种参数
												headHeight = data.height
						　　    }).exec();
						setTimeout(function () {
								me.pageHeight= res.windowHeight - infoHeight - headHeight
								}, 1000);
						     }
						});
						me.initMain()
						
						 
				}
			}
			
    },
		methods: {
			sumCount(val,item){
				var list = this.cuIList
				this.$set(item,'dispatchNum', val.detail.value);
				var count = 0
				for(var i = 0; i<list.length;i++){
					count += Number(list[i].dispatchNum)
				}
				console.log(count)
				this.form.bNum = count
			},
			cityClick(item) {
				this.$set(this.popupForm,'userName', item.FName);
				this.$set(this.popupForm,'userId', item.FItemID);
				this.modalName = null
			},
			clearList() {
				const that = this
				if(that.cuIList.length>0){
					uni.showModal({
						title: '温馨提示',
						content: '是否清空列表，清空之后将无法还原！',
						success: function (res) {
							if (res.confirm) {
							   that.cuIList = []
							   that.initMain()
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			},
			initMain(){
				const me = this
				this.form.workDate = this.getDay('', 0).date
				basic.getDeptList({}).then(res => {
					if(res.success){
						me.deptList=res.data
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg,
					});
				});
				basic.getEmpList({}).then(res => {
					if(res.success){
						me.empList=res.data
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg,
					});
				});
				me.loadModal = false
				me.isClick = false
			},
			saveData(){
				this.isClick = true
				let result = []
				let list = this.cuIList
				let me = this
				let array = []
				for(let i in list){
					let obj = {}
					obj.userId = list[i].userId
					obj.dispatchNum = list[i].dispatchNum
					obj.processId = this.form.processID
					obj.processTeamId = this.form.fdeptID
					obj.workDate = this.form.workDate
					obj.productWorkDetailId = this.form.productWorkDetailId
					array.push(obj)
				}
				console.log(JSON.stringify(array))
				if(this.form.processID == null || this.form.processID == ''){
					this.isClick = false
					return uni.showToast({
					icon: 'none',
					title: '工序不能为空',
					});
				}
				if(this.form.fdeptID == null || this.form.fdeptID == ''){
					this.isClick = false
					return uni.showToast({
						icon: 'none',
						title: '班组不能为空',
					});
				}
				
				if(array.length <= 0){
					this.isClick = false
					return uni.showToast({
						icon: 'none',
						title: '请派工',
					});
				}
				if(Number(this.form.bNum)>Number(this.form.planNum)){
					this.isClick = false
					return uni.showToast({
						icon: 'none',
						title: '不能大于计划数量',
					});
				}
				if(this.form.workDate == null || this.form.workDate == ''){
					this.isClick = false
					return uni.showToast({
						icon: 'none',
						title: '日期不能为空',
					});
				}
				workshop.productWorkDispatchAdd(JSON.stringify(array)).then(res => {
						if(res.success){
							this.cuIList = []
							uni.showToast({
								icon: 'success',
								title: res.msg,
							});
							this.form.bNum = 0
							this.initMain()
							if(this.isOrder){
							setTimeout(function () {
								uni.$emit("handleBack",{startDate: me.startDate,endDate: me.endDate});
								uni.navigateBack({
								 url: '../workshop/dispatching'
								});
							}, 1000)
						}
						}
					}).catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.msg,
						});
						this.isClick = false
					})
				
			},
			showModal(index, item) {
				this.modalName = 'Modal'
				this.popupForm = item
			},
			hideModal(e) {
				this.modalName = null
			},
			del(index, item) {
				this.cuIList.splice(index,1)
				var count = 0
				for(var i = 0; i<list.length;i++){
					count += Number(list[i].dispatchNum)
				}
				this.form.bNum = count
			},
			// 查询前后三天日期
			     getDay(date, day){
			       var today = new Date();
			        var targetday_milliseconds=today.getTime() + 1000*60*60*24*day
			        today.setTime(targetday_milliseconds) //注意，这行是关键代码
			        var tYear = today.getFullYear()
			        var tMonth = today.getMonth()
			        var tDate = today.getDate()
			        var getDay = today.getDay()
			        tMonth = this.doHandleMonth(tMonth + 1)
			        tDate = this.doHandleMonth(tDate)
			        var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
			        var week = weeks[getDay]
			        return {
			          day: tDate,
			          week: week,
			          date: tYear + "-" + tMonth + "-" + tDate
			        }
			      },
			      doHandleMonth(month) {
			        var m = month;
			        if(month.toString().length == 1) {
			          m = "0" + month;
			        }
			        return m;
			      },
				   deptChange(val){
				 		this.form.fdeptID = val			
				     },processChange(val){
				 		this.form.processID = val			
				     },
					 PickerChange(e, item) {
					 	this.$set(item,'userName', this.empList[e.detail.value].FName);
					 	this.$set(item,'userId', this.empList[e.detail.value].FItemID);
					 },
		bindChange(e){
			this.form.fdate = e
		}, 
		fabClick() {
			var that = this
			that.cuIList.push({
				userId: '',
				dispatchNum: 0
			})
		},// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		}
	}
</script>

<style>
	.cu-item{
		float: left;
		width: 50%;
	}
	.cu-item .content{
		float: left;
	}
	.cu-list.menu-avatar>.cu-item .content{
		left: 5px;
	}
	.cu-list.menu-avatar>.cu-item .action{
		
	}
	.input{
		height: 30px;
	}
	.box{
		width: 100%;
	}
	.uni-input-placeholder, .uni-input-input{
		font-size: 13px;
	}
	.action,.content{
		font-size: 13px !important;
	}
	.ruidata{
		font-size: 13px;
		height: 7vw !important;
	}
	.cu-bar{
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
