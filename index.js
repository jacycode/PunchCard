//W3C标准API
if(navigator.geolocation) {
    console.log('start w3C');
    navigator.geolocation.getCurrentPosition(
        function (position) {
            console.log('sss');
            var longitude = position.coords.longitude;
            var latitude = position.coords.latitude;
            console.log(longitude)
            console.log(latitude)
        },
        function (e) {
            console.log('eee');
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

//高德插件API
var latitude;
var longtitude;
var amap = new AMap.Map('iCenter');
amap.plugin('AMap.Geolocation', function() {
    console.log('start AMap');
    var geolocation = new AMap.Geolocation({
        // 是否使用高精度定位，默认：true
        enableHighAccuracy: true,
        // 设置定位超时时间，默认：无穷大
        timeout: 10000,
        // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
        buttonOffset: new AMap.Pixel(10, 20),
        //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        zoomToAccuracy: true,
        //  定位按钮的排放位置,  RB表示右下
        buttonPosition: 'RB'
    })

    geolocation.getCurrentPosition()
    AMap.event.addListener(geolocation, 'complete', onComplete)
    AMap.event.addListener(geolocation, 'error', onError)

    function onComplete (data) {
        // data是具体的定位信息
        console.log(data);
        latitude = data.position.getLat();
        longtitude = data.position.getLng();
    }

    function onError (data) {
        // 定位出错
        console.log(data);
    }
})

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
    // if(longtitude == undefined || latitude == undefined){
    //     alert('locate...');
    // }else if(latitude > 39.946 && latitude < 39.947 && longtitude > 116.292 && longtitude < 116.293){
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
    // }else{
    //     alert("invalid area");
    // }

});