$(function() {
	$("#startTime input").datetimepicker({
		format: "Y-m-d",
        hours24: 'true',
        step: 10,
        lang: 'ch',
        timepicker: false,    //关闭时间选项
        onShow: function (ct) {
            this.setOptions({
                maxDate: jQuery('#end').val() ? jQuery('#end').val() : false
            });
        }
	});
	$("#startTime span").click(function() {
		$("#startTime input").datetimepicker("show");
	});
	
	$("#endTime input").datetimepicker({
		format: "Y-m-d",
        hours24: 'true',
        step: 10,
        lang: 'ch',
        timepicker: false,    //关闭时间选项
        onShow: function (ct) {
            this.setOptions({
                maxDate: jQuery('#end').val() ? jQuery('#end').val() : false
            });
        }
	});
	$("#endTime span").click(function() {
		$("#endTime input").datetimepicker("show");
	});
	
	
	
	var vm = new ViewModel();
	ko.applyBindings(vm);
});


function ViewModel() {
	const self = this;
	self.name = ko.observable();// 姓名
	self.doctor = ko.observable(); // 医生
	self.startTime = ko.observable();// 开始时间
	self.endTime = ko.observable();// 开始时间
	self.selectedSex = ko.observable(); // 选中的性别
	self.keywords = ko.observable();// 选中的关键字

	self.sexList = ko.observableArray([
		{ sex: "请选择", sexCode: "0" },
    	{ sex: "男", sexCode: "1" },
    	{ sex: "女", sexCode: "2" }
	]); // 性别
	self.keywordsList = ko.observableArray([
		{name: "请选择",type: "0"},
		{name: "检查提示",type: "1"},
		{name: "检查所见",type: "2"},
		{name: "病人标记",type: "3"},
		{name: "临床诊断",type: "4"},
		{name: "临床科室",type: "5"},
		{name: "临床医生",type: "6"},
		{name: "住院号",type: "7"}
	]); // 关键字
	
	// 分页
	self.pageSize = ko.observable(10); // 每页呈现条数
	self.pageIndex = ko.observable(); // 要访问的页面
	self.pageCount = ko.observable(1); // 总页数
	self.allPages = ko.observableArray([]); // 页码
	self.totalCount = ko.observable(1); // 总共多少条数据
	
	self.refresh = function() {
		// 获取所有的查询参数
		var searchParameter = "?name="+self.name()+"&sex="+self.selectedSex()+"&doctor="+self.doctor()+
			"&keyword="+self.keywords()+"&startTime="+self.startTime()+"&endTime="+self.endTime();
			
		if(self.pageIndex()>self.pageCount()) {
			self.pageIndex(self.pageCount());
		}
		if(self.pageIndex() < 1) {
			self.pageIndex(1);
		}
	}
	
	self.search = function() {
		self.pageIndex(1);
		self.refresh();
	}
	// 查看详细信息
	self.detailInfo = function() {
		
	}
	// 进入到诊断界面
	self.edit = function() {
		
	}
	
	self.last = function() {
		
	}
	self.next = function() {
		
	}
}