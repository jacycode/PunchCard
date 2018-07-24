//请求打卡数据
function loadrefresh() {
    if($.cookie('username') == undefined){
        location.href = "/login.html";
    }
    $.ajax("/query", {
        method:"post",
        data: {username: $.cookie('username')},
        success: function (data, code, xhr) {
            if (code == 'success'){
                if(data.code == 0){
                    var eles = data.data.map(function (obj, ind) {
                        return "<li>"+obj.content+" "+obj.overtime+"h"+"</li>";
                    });
                    $('#recorder ul').html(eles);
                }else{
                    alert('server error');
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
loadrefresh();

//打卡按钮 点击事件
$("#punchBt").on('click', function () {
    if(navigator.geolocation) {
        console.log('获取位置');
        navigator.geolocation.getCurrentPosition(
            function (position) {
                console.log('成功');
                var longitude = position.coords.longitude;
                var latitude = position.coords.latitude;
                console.log(longitude)
                console.log(latitude)
            },
            function (e) {
                console.log('失败');
                var msg = e.code;
                var dd = e.message;
                console.log(msg)
                console.log(dd)
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        )
    }
    //打卡
    $.ajax("/punch", {
        method:"post",
        data: {"username": $.cookie('username'),
               "punchtime": new Date().getTime()},
        success: function (data, code, xhr) {
            if (code == 'success'){
                if(data.code == 0){
                    loadrefresh();
                }else{
                    alert('server error');
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
});