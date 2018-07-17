//请求打卡数据
function loadrefresh() {
    $.ajax("/query", {
        method:"post",
        data: {username: $.cookie('username')},
        success: function (data, code, xhr) {
            if (code == 'success'){
                if(data.code == 0){
                    var eles = data.data.map(function (obj, ind) {
                        return "<li>"+obj.content+"</li>";
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