# pubo

**2018-05-01** 
>   添加截图后，对右侧缩略图二次编辑的功能，之前的下载功能不影响，删除功能目前还有一个bug，因为是left和right分开了，之前的写法是没分，所以删除imgArr容器没问题，现在分开展示，需要对imgArr中的数据进行过滤

**2018-04-28** 

>	解决截图中，重复触发截图事件,其实就是click事件嵌套，事件重复注册，可以取消冒泡，可以将事件由嵌套拆称2个独立的，都能解决问题
>	
>	参考链接： [http://blog.sina.com.cn/s/blog_4ffbe80f0101e6co.html](http://blog.sina.com.cn/s/blog_4ffbe80f0101e6co.html)

**2018-04-27** d291b26 分支
>   解决左右2个视频同步控制Bug
>   
>   解决动态修改视频源src报错问题,之前的测试src都直接写死在source标签中，实际开发必定不是这样  
>   参考链接： [https://segmentfault.com/q/1010000006979553](https://segmentfault.com/q/1010000006979553)
```js
    var options = {}; // 这里就有很多扩展的属性，详细参考
    var player1 =  videojs("videoTag-left",options);
    player1.ready(function(){
        

        this.src("http://www.example.com/path/to/video.mp4");

        this.play(); // 调用这里，视频ready，就会直接播放，如果想单独通过一个按钮控制，就不加这句，将逻辑移出去

        // 我的情景是单独控制，所以注释this.play()
        handleVideoOperate(this,"videoTag-left");
    });

// 单独控制播放，我的页面上是有个2个视频的，所以下面会有player1,player2
// _player 就是另一个视频，我的有2个视频同时播放，如果你的需求只有一个，就特别简单，忽略相关的_player即可
// 参数 __this 有2个下划线，注意
function handleVideoOperate(__this,className) {

    var _this = __this;

    var _player = videojs(className);
    

    // 获取当前播放的时间和速率
    // 当改变播放时间，拖动播放轴时--同时快进和后退
    _this.on("seeked",function() {
        videoOpt.currentTime = _this.currentTime();
        _player.currentTime(videoOpt.currentTime);
    })
    _this.on("waiting",function() {
        //alert("视频正在缓冲");
    });
    // 同步声音，这里可能没有必要，影像应该是没有声音的
    _this.on("volumechange",function() {
        
        
        videoOpt.volume = _this.volume();
        //console.log(videoOpt.volume,typeof videoOpt.volume)
        _player.volume(videoOpt.volume);
    });
    // 同步控制播放速度
    _this.on("ratechange",function() {
        videoOpt.playbackRate = _this.playbackRate();
        _player.playbackRate(videoOpt.playbackRate);
        
    });
    // 做事件监听
    _this.on('ended',function() {
        alert("结束");
    
        // 提示医生，切换病人信息吧，ajax
        videojs.log('视频结束');
    })
    //
    _this.on("error",function(error) {
        _this.
        console.log(error);
    })
}

```

>   
>   新增快速截取单帧视频功能-集成到暂停和播放一个按钮上，暂停就截图，与医院系统做成一致的实现
>   
>   解决快速点击截图，1秒钟点击40-50下，报错 Uncaught (in promise) DOMException: The play() request was interrupted by a call to pause(). https://goo.gl/LdLk22   当然正常的医生也不会这样操作  
>   参考链接：[https://www.cnblogs.com/zzsdream/p/6125223.html](https://www.cnblogs.com/zzsdream/p/6125223.html)
>   

**2018-04-25** 1755eb2 分支
>   实现视频的同步快进，后退，音量同步，同步播放，暂停

**2018-04-23 21:21** f9f32a8 分支

>   完成sm，md,lg 3种适配问题

**2018-04-23**  1632969 分支

>   解决bootstrap下面多列row高度不一致问题

*参考链接*：[https://blog.csdn.net/jewely/article/details/53006123](https://blog.csdn.net/jewely/article/details/53006123)

