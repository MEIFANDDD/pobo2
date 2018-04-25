// 顶部自动走的时间
(function() {
	var time = $(".time");
	setInterval(function() {
		time.text(getCurrentTime());
	}, 1000);
})();

// 删除功能，指定删除对应图片的序号
let deleteIndex = 0;
// 在每一次保存时，将img保存到这里
let imgArr = [];

$(function() {
	// 功能面板--左侧2组元素--夏
	let btnGroup1 = $(".btn-group-1");
	// 功能面板--右侧2组元素--夏
	let btnGroup2 = $(".btn-group-2");

	// 切换按钮
	$(".xia-btn-left").click(function() {
		btnGroup1.fadeIn().show();
		btnGroup2.fadeOut().hide();

		$(".xia-btn-right").find(".circle-middle").removeClass("activeBtn");
		$(this).find(".circle-middle").addClass("activeBtn");
	});
	$(".xia-btn-right").click(function() {
		btnGroup1.fadeOut().hide();
		btnGroup2.fadeIn().show();

		$(".xia-btn-left").find(".circle-middle").removeClass("activeBtn");
		$(this).find(".circle-middle").addClass("activeBtn");

	});

	// 监控数据变化
	let vm = new ViewModel();
	ko.applyBindings(vm);

});

// 双向数据绑定
function ViewModel() {
	const self = this;

	self.checkTitlte = ko.observable("C5-2Fs"); // 顶部标题
	self.checkPosition = ko.observable("腹部"); // 检查位置
	self.chekDesc = ko.observable(); // 检查描述
	self.chiefComplaint = ko.observable(); // 主诉
	self.pastHistory = ko.observable(); // 既往史
	self.height = ko.observable(); // 身高
	self.weight = ko.observable(); // 体重
	self.isEnable = ko.observable(false);

	self.save = function() {
		if($(".leftImage").attr("src") == "") {
			console.log("左边没有图像");
			return;
		}
		if($(".rightImage").attr("src") == "") {
			console.log("右边没有图像");
			return;
		}
		//拿到图片盒子
		html2canvas($(".image-online")[0]).then((canvas) => {
			//Canvas2Image.saveAsPNG(canvas,500,500);
			//console.log(canvas);
			var image = new Image();
			image.src = canvas.toDataURL("image/png", 1.0);
			// 将这个图片数据传出去
			let obj = {
				imgSource: image,
				currentTime: getCurrentTime()
			}
			imgArr.push(obj);
			console.log(imgArr[0].imgSource.src);
			//document.write(imgArr[0].imgSource.src)
			/*
			 参考链接地址： https://www.cnblogs.com/GoTing/p/6206466.html
			 使用canvas2image.js 会出现图片没有后缀名的情况
			 * */

			//console.log(convertCanvasToImage(canvas));
			// 将canvas转变成图片
			var img = convertCanvasToImage(canvas);
			//document.body.appendChild(convertCanvasToImage(canvas));
			$(".right-content")[0].append(img);

			// 获取所有的图片列表
			$(".right-content img").click(function(event) {
				console.log("当前点击的图片序号", $(this).index());
				// 获取图片序号
				deleteIndex = $(this).index();
				$(this).siblings().css({
					"border": "none"
				});
				$(this).css({
					"border": "4px solid blue"
				});
			});
		});

	}

	self.deleteImg = function() {
		if(isExitImg()) {
			$(".right-content").find("img")[deleteIndex].remove();
			imgArr.splice(deleteIndex, 1);
		} else {
			console.log("右侧没有缩略图");
		}
	}
	/*下载*/
	self.download = function() {
		/*
		 	下载的思路：
		 	1、再上面self.save 保存的时候，我们就需要将图片的信息 （保存的时间，图片数据）--push到全局imgArr
		 	2、再点击 self.download时,操作的并不是缩略图的图片，而是imgArr中保存的
		 	3、右侧缩略图是调用self.save方法，每张图片都会对应一个时间，如果连续点击相同图片下载，本地文件名是相同的。
		 * */
		var _fixType = function(type) {
			type = type.toLowerCase().replace(/jpg/i, 'jpeg');
			var r = type.match(/png|jpeg|bmp|gif/)[0];
			return 'image/' + r;
		};

		// imgSource是全局的
		let imgData = imgArr[deleteIndex].imgSource.src.replace(_fixType("png"), 'image/octet-stream');

		var saveFile = function(data, filename) {
			var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
			save_link.href = data;
			save_link.download = filename;

			var event = document.createEvent('MouseEvents');
			event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			save_link.dispatchEvent(event);
		};

		var filename = 'scann-' + imgArr[deleteIndex].currentTime + '.' + "png";

		// 下载图片
		saveFile(imgData, filename);

	}
	self.cancel = function() {
		layer.open({
			title: "确认",
			content: "确定要取消检查吗？",
			btn: ["确认", "取消"],
			yes: function(index) {
				// 做ajax请求，保存数据

				// layer.close(index);
			},
			btn2: function() {
				//alert(false);
			},
			btnAlign: "c",
		});
	}
	// 滚动到顶部
	self.scrollToTop = function() {
		$(".right-content").scrollTop(1);

		if($(".right-content").scrollTop() > 0) {
			$(".right-content").scrollTop(0);
		}
	}
	// 滚动到底部
	self.scrollToBottom = function() {
		let obj = $(".right-content")[0];
		console.log(obj);
		// 判断是否出现滚动条
		if(obj.scrollHeight > obj.clientHeight || obj.offsetHeight > obj.clientHeight) {
			//$(".right-content").scrollTop(parseInt(obj.scrollHeight));
			obj.scrollTop = obj.scrollHeight;
		}
	}
}
/*将canvas转为图片*/
function convertCanvasToImage(canvas) {
	var image = new Image();
	image.src = canvas.toDataURL("image/png", 1.0);
	return image;
}

function isExitImg() {
	let imgContent = $(".right-content");
	// 判断缩略图容器中是否有图片
	if(imgContent.has("img").length === 0) {
		console.log("右侧没有缩略图");
		return false;
	}
	return true;
}

function getCurrentTime() {
	let now = new Date();
	let year = now.getFullYear();
	let month = now.getMonth() + 1;
	month = month < 10 ? ("0" + month) : month;
	let day = now.getDate();
	day = day < 10 ? ("0" + day) : day;
	let hour = now.getHours();
	hour = hour < 10 ? ("0" + hour) : hour;
	let mimutes = now.getMinutes();
	mimutes = mimutes < 10 ? ("0" + mimutes) : mimutes;
	let seconds = now.getSeconds();
	seconds = seconds < 10 ? ("0" + seconds) : seconds;
	let downloadTime = year + "/" + month + "/" + day + " " + hour + "." + mimutes + "." + seconds;
	return downloadTime;
}

/*************梅帆********************/
var s1; //定义五个定时器
var s2;
var s3;
var s4;
var s5;

$(function() {
	//切换按钮
	let btn3Group1 = $(".btn3-group-1");
	let btn3Group2 = $(".btn3-group-2");
	let btn3Group3 = $(".btn3-group-3");

	$(".shift-btn3 .left").click(function() {
		btn3Group1.show();
		btn3Group2.hide();
		btn3Group3.hide();
		$(".shift-btn3 .right").removeClass("activeBtn");
		$(".shift-btn3 .mid").removeClass("activeBtn");
		$(this).addClass("activeBtn");
	});
	$(".shift-btn3 .mid").click(function() {
		btn3Group1.hide();
		btn3Group2.show();
		btn3Group3.hide();
		$(".shift-btn3 .right").removeClass("activeBtn");
		$(".shift-btn3 .left").removeClass("activeBtn");
		$(this).addClass("activeBtn");
	});
	$(".shift-btn3 .right").click(function() {
		btn3Group1.hide();
		btn3Group2.hide();
		btn3Group3.show();
		$(".shift-btn3 .left").removeClass("activeBtn");
		$(".shift-btn3 .mid").removeClass("activeBtn");
		$(this).addClass("activeBtn");
	});

	//点击事件

	$(".btn3-frequency").click(function() {
		clearTime();
		$(".mune-nav").css("display", "none");
		$(".mune-btn3-tsi").css("display", "none");
		$(".mune-btn3-pseudocolormap").css("display", "none");
		$(".mune-btn3-slide").css("display", "none");
		$(".mune-btn3-frequency").css("display", "block");
		s1 = setTimeout(function() { //点击后5s切换回菜单栏
			$(".mune-btn3-frequency").css("display", "none"), $(".mune-nav").css("display", "block");
		}, 5000);
	})
	$(".btn3-tsi").click(function() {
		clearTime();
		$(".mune-nav").css("display", "none");
		$(".mune-btn3-pseudocolormap").css("display", "none");
		$(".mune-btn3-frequency").css("display", "none");
		$(".mune-btn3-slide").css("display", "none");
		$(".mune-btn3-tsi").css("display", "block");
		s2 = setTimeout(function() { //点击后5s切换回菜单栏
			$(".mune-btn3-tsi").css("display", "none"), $(".mune-nav").css("display", "block");
		}, 5000);
	})
	$(".btn3-pseudocolormap").click(function() {
		clearTime();
		$(".mune-nav").css("display", "none");
		$(".mune-btn3-frequency").css("display", "none");
		$(".mune-btn3-tsi").css("display", "none");
		$(".mune-btn3-slide").css("display", "none");
		$(".mune-btn3-pseudocolormap").css("display", "block");
		s3 = setTimeout(function() { //点击后5s切换回菜单栏
			$(".mune-btn3-pseudocolormap").css("display", "none"), $(".mune-nav").css("display", "block");
		}, 5000);
	})
	$(".btn3-gain").click(function() {
		clearTime();
		$(".mune-nav").css("display", "none");
		$(".mune-btn3-frequency").css("display", "none");
		$(".mune-btn3-tsi").css("display", "none");
		$(".mune-btn3-pseudocolormap").css("display", "none");
		$(".mune-btn3-slide").css("display", "block");
		$(".right-box1").css("display", "none");
		$(".right-box2").css("display", "block");
		s4 = setTimeout(function() { //点击后5s切换回菜单栏
			$(".mune-btn3-slide").css("display", "none"), $(".mune-nav").css("display", "block"), $(".right-box2").css("display", "none"), $(".right-box1").css("display", "block");
		}, 5000);
		s5 = setTimeout(function() {
			$(".right-box2").css("display", "none"), $(".right.box1").css("display", "none");
		}, 5000);
	})
	$(".btn3-puncture").click(function() {
		alert("注意穿刺！");
	})
});

// 清除定时器
function clearTime() {
	clearTimeout(s1);
	clearTimeout(s2);
	clearTimeout(s3);
	clearTimeout(s4);
}

/****************************************/
var options = {
	language: 'zh-CN', // 默认是 en
	
	controls: true,

	
	poster: "https://ss2.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=404a1782eb1190ef1efb94dffe1a9df7/3ac79f3df8dcd1007fde3f4e7e8b4710b9122f1b.jpg",
	preload: "auto",
	
	playbackRates:[0.5,1,1.5,1.75,2], // 控制播放速度，视频中会出一个控件
};


// 同时控制视频的速率和当前播发到哪一个时间点
var videoOpt = {
	currentTime: '',
	speed: 1,
	volume: ''
}


// 截屏操作
$("#screenshotBtn").click(()=> {
	
});

var player = videojs('videoTag-left',options,function() {
	videojs.log('vidoe已经准备好了');
	var _this = this;

	/*视频播放的逻辑*/
	// 播放操作
	$("#playBtn").click(function() {
	
		var btnText = $(this).text();
		
		var player2 = videojs("videoTag-right");
		
		if(btnText === "播放") {
			$(this).text("暂停");
			_this.play();
			player2.play();
			$("#screenshotBtn").attr('disabled',true);
		} else if(btnText === "暂停") {
			$(this).text("播放");
			_this.pause();
			player2.pause();
			$("#screenshotBtn").attr('disabled',false);	
		}
	});


	// 获取当前播放的时间和速率
	
	// 当改变播放时间，拖动播放轴时--同时快进和后退
	_this.on("seeked",function() {
		videoOpt.currentTime = _this.currentTime();
		player2.currentTime(videoOpt.currentTime);
	})
	_this.on("waiting",function() {
		alert("视频正在缓冲");
	});
	// 同步声音，这里可能没有必要，影像应该是没有声音的
	_this.on("volumechange",function() {
		videoOpt.volume = _this.volume();
		//console.log(videoOpt.volume,typeof videoOpt.volume)
		player2.volume(videoOpt.volume);
	});
	
	
	// 做事件监听
	this.on('ended',()=> {
		
		videojs.log('视频结束');
	})
});
var player2 = videojs("videoTag-right",options,function() {
	
})
