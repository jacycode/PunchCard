//switch按钮状态改变监听   登录<-->注册
var isLogin = true;
$("#switchBt").on('click', function(){
    if($('.switch-anim').prop('checked')){
        //注册
        isLogin = false;
        $("#passwordAgain").css('visibility', 'visible');
    }else{
        //登录
        isLogin = true;
        $("#passwordAgain").css('visibility', 'hidden');
    }
});

//OK 按钮监听
$('#okBt').on('click', function () {
    if(isLogin){
        //登录
        if($('#username').val()!="" && $("#password").val()!=""){
            $.ajax("/login", {
                method:"post",
                data: {"username": $('#username').val(),
                       "password": $('#password').val()},
                success: function (data, code, xhr) {
                    if (code == 'success'){
                        if(data.code == 0){
                            location.href = "/index.html";
                        }else{
                            alert('input error');
                        }
                    }else{
                        alert('net error');
                    }
                },
                error: function () {
                    alert('net error');
                },
                dataType:"json"
            });
        }
    }else{
        //注册
        if($('#username').val()!="" && $("#password").val()!="" && $("#password").val()==$("#passwordAgain").val()){
            $.ajax("/register",{
                method:"post",
                data: {"username": $('#username').val(),
                       "password": $('#password').val()},
                success:function (data, code, xhr) {
                    console.log('success', code)
                    if (code == 'success'){
                        console.log('200')
                        if(data.code == 0){
                            console.log('0')
                            alert('Success, plesase login.');
                        }else{
                            alert('input error');
                        }
                    }else{
                        alert('net error');
                    }
                },
                error:function () {
                    alert('net error');
                },
                dataType:"json"
            });
        }
    }
});

// //iOS
// $(document).on('focusin', function () {
//     //软键盘弹出的事件处理
//     $('#okBt').css("display", 'none');
//     $('#switchBt').css("display", 'none');
//     $('#copyright').css("display", 'none');
// });
//
// $(document).on('focusout', function () {
//     //软键盘收起的事件处理
//     $('#okBt').css("display", 'block');
//     $('#switchBt').css("display", 'inline-block');
//     $('#copyright').css("display", 'block');
// });
// //Android
// var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
// $(window).on('resize', function () {
//     var nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight;
//     if (clientHeight > nowClientHeight + 100) {
//         //键盘弹出的事件处理
//         $('#okBt').css("display", 'none');
//         $('#switchBt').css("display", 'none');
//         $('#copyright').css("display", 'none');
//         console.log(1111)
//     } else {
//         //键盘收起的事件处理
//         $('#okBt').css("display", 'block');
//         $('#switchBt').css("display", 'inline-block');
//         $('#copyright').css("display", 'block');
//         console.log(2222)
//     }
// });