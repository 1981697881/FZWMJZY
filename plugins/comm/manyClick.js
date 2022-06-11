// 处理多次点击
function manyCk(fn) {
    let that = this;
	if(typeof(that.onoff) == "undefined"){
		that.onoff = true
	}
   if (that.onoff) {
        that.onoff = false;
		fn();
        setTimeout(function () {
            that.onoff = true;
        }, 2000)
    } else {
		that.onoff = false;
		uni.showToast({
			icon: 'none',
			title: '请不要频繁点击'
		});
    }
}
export {
    manyCk
}