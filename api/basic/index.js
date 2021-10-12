import Request from '@/plugins/request/js/index';

export default {
	//扫码
    barcodeScan(params) {
        return Request().post('/api/basic/barcodeScan', {
            header: {
				accept: '*/*'
            },
			data: params
        });
    },
	//扫码2
    barcodeScanT(params) {
        return Request().post('/api/materiel/barcodeScan', {
            header: {
				accept: '*/*'
            },
			data: params
        });
    },
	//扫库位码查询仓库
    selectFdCStockIdByFdCSPId(params) {
        return Request().get('/api/basic/selectFdCStockIdByFdCSPId', {
            header: {
				accept: '*/*'
            },
			data: params
        });
    },//扫码获取库存
    inventoryByBarcode(params) {
        return Request().get('/api/basic/inventoryByBarcode', {
            header: {
				accept: '*/*'
            },
			data: params
        });
    },
	//获取单号
	getBillNo(params) {
        return Request().get('/api/billList/getBillNo', {
            header: {
				accept: '*/*'
            },
			data: params
        });
    },
	//获取部门
	getDeptList(params) {
        return Request().post('/api/basic/deptList', {
            header: {
				contentType: 'application/json',
            },
			data: params
        });
    },//获取权限
	getSysAuth(params) {
        return Request().get('/sysUser/getSysAuth', {
			data: params
        });
    },
	//获取菜单权限 
	getSysMenuById(params) {
        return Request().get('/sysMenu/getSysMenuById/'+ params);
    },
	//获取仓库
	getStockList(params) {
        return Request().post('/api/basic/stockList', {
            header: {
				contentType: 'application/json',
            },
			data: params
        });
    },//检验库存
	selectInvQty(params) {
        return Request().post('/api/invCheck/selectInvQty', {
            header: {
				contentType: 'application/json',
            },
			data: params
        });
    },
	//获取单据
	getOrderList(params) {
        return Request().post('/api/billList/queryBillList', {
            header: {
				contentType: 'application/json',
            },
			data: params
        });
    },
	//获取供应商
	supplierList(params) {
	    return Request().post('/api/basic/supplierList', {
	        header: {
				contentType: 'application/json',
	        },
			data: params
	    });
	},
	//获取客户
	customerList(params) {
	    return Request().post('/api/basic/customerList', {
	        header: {
				contentType: 'application/json',
	        },
			data: params
	    });
	},//获取职员
	getEmpList(params) {
	    return Request().post('/api/basic/empList', {
	        header: {
				contentType: 'application/json',
	        },
			data: params
	    });
	},
	//获取库存
	inventoryList(params) {
	    return Request().post('/api/basic/inventory', {
	        header: {
				contentType: 'application/json',
	        },
			data: params
	    });
	},
	//根据物料查库存 
	selectInvListByItemNumber(params) {
	    return Request().get('/api/invCheck/selectInvListByItemNumber', {
	        header: {
	       	 accept: '*/*'
	        },
			data: params
	    });
	},
	//获取物料
	getItemList(params) {
	    return Request().post('/item/itemList/1/20', {
	        header: {
				contentType: 'application/json',
	        },
			data: params
	    });
	},
	//获取更新
	getAndroidVersion(params) {
	    return Request().post('/api/basic/getAndroidVersion', {
	        header: {
				contentType: 'application/json',
	        },
			data: params
	    });
	},
};
