/**
 * Created by gouzheng on 17-8-5.
 */
$(function () {
   var $player=$("#player");
   var $play=$("#play");
   var $stop=$("#stop");
   var $volume=$("#volume");
   var $expand=$("#expand");
   var $upload=$("#upload");

   var player=$player[0];

   var $file=$("#file");
   var $timer=$("#timer");

   var $progressBar=$("#progressBar");
   var $innerBar=$("#innerBar");
   var $volumeControl=$("#volume-control");
   var $volumeinner=$("#volume-inner");
   // 点击按钮,在暂停和播放两个状态之间转换
   $play.on('click',function () {
       if(player.paused)
       {
           player.play();
           $(this).removeClass('icon-play').addClass('icon-pause');
       }
       else{
           player.pause();
           $(this).removeClass('icon-pause').addClass('icon-play');
       }
   });
   //点击停止按钮,停止视频播放
    $stop.on('click',function () {
        player.currentTime=0;
        $innerBar.css('width',0+"px");
    });
    //点击静音按钮,在静音和有声音之间转换
    $volume.on('click',function () {
        //当前状态为静音状态
        if(player.muted)
        {
            player.muted=false;
            $(this).removeClass('icon-volume-mute').addClass('icon-volume');
            $volumeinner.css('width',100+'%');
        }
        else{
            player.muted=true;
            $(this).removeClass('icon-volume').addClass('icon-volume-mute');
            $volumeinner.css('width',0);
        }
    });
    //点击全屏按钮切换状态
    $expand.on('click',function () {
        if(!document.webkitInFullScreen)
        {
            player.webkitRequestFullScreen();
            $(this).removeClass('icon-expand').addClass('icon-contract');
        }
        else{
            document.webkitRequestFullScreen();
            $(this).removeClass('icon-contract').addClass('icon-expand');
        }
    });
    //点击添加文件,为自己的按钮添加点击事件
    $upload.on('click',function () {
        $file.trigger('click');
    });
    //当确定文件后,检测类型
    $file.on('change',function (e) {
        var file=e.target.files[0];
        var canPlayType=player.canPlayType(file.type);
        //判断浏览器是否支持打开的文件类型
        if(canPlayType==='maybe'||canPlayType==='probably')
        {
            src=window.URL.createObjectURL(file);
            player.src=src;
            $player.removeClass('icon-pause').addClass('icon-play');
            player.onload=function () {
                window.URL.revokeObjectURL(src);
            }
        }
    });
    //视频播放进度改变,视频当前播放的时间显示更新
    $player.on('timeupdate',function () {
        //转换秒数
        var time=player.currentTime.toFixed(1);
        var minutes=Math.floor((time/60)%60);
        var seconds=Math.floor(time%60);
        //格式补全
        if(seconds<10)
        {
            seconds='0'+seconds;
        }
        $timer.text(minutes+':'+seconds);

        var w=$progressBar.width();
        if(player.duration)
        {
            var per=(player.currentTime/player.duration.toFixed(3));
            window.per=per;
        }
        else {
            per=0;
        }
        $innerBar.css('width',(w*per).toFixed(0)+'px');
        if(player.ended)
        {
            $play.removeClass('icon-pause').addClass('icon-play');
        }
    });
    //点击当前进度条的任意位置,改变进度条的显示状态,调整视频的播放进度
    $progressBar.on('click',function (e) {
        var w=$(this).width();
        var x=e.offsetX;
        window.per=(x/w).toFixed(3);
        var duration=player.duration;
        player.currentTime=(duration*window.per).toFixed(0);
        $innerBar.css('width',x+'px');
    });
    //点击音量控制条的任意位置,调整当前播放视频的音量
    $volumeControl.on('click',function (e) {
        var w=$(this).width();
        var x=e.offsetX;
        window.vol=(x/w).toFixed(1);

        player.volume=window.vol;
        $volumeinner.css('width',x+'px');
    });
    //全屏状态切换,视频进度控制条的长度改变
    $(document).on('webkitfullscreenchange',function (e) {
        var w=$progressBar.width();
        var w1=$volumeControl.width();
        if(window.per)
        {
            $innerBar.css('width',(window.per*w).toFixed(0)+'px');
        }
        else{
            $innerBar.css('width',(window.vol*w1).toFixed(0)+'px');
        }
    });
});