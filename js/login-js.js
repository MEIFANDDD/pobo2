$(function() {
    $(".btn-login").on('click',function(){
        var us = $(".inp-username").val();
        var ps = $(".inp-password").val();
        if(us === "" || ps === "") {
            layer.msg('用户名或密码为空');
            return;
        }
        $.ajax({
            type:"POST",
            url:"getUserByUser",
            data:{'username':us,"password":ps},
            async:false,
            dataType:"json",
            success:function (data) {
                console.log(data)
                if (us == data[0].username && ps == data[0].password){
                    layer.msg("登陆成功");
                    setTimeout("window.location.href='patientlist.html'",1000);
                    //window.location.href='patientList.html';
                }else{
                    layer.msg("用户名或密码错误");
                }
            },
            error:function () {
                layer.msg("登陆失败");
            }
        })
    })
});