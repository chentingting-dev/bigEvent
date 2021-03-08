$(function(){
    getUserInfo();
    var layer = layui.layer
    //为退出标签注册点击事件
    $('#btnLogOut').on('click',function(){
        // console.log('ok');

        //layui中的弹出层，提示用户是否退出
        layer.confirm('是否确定退出?', {icon: 3, title:'提示'}, function(index){
            //do something
            //1.先清空localStorage中的token数据
            localStorage.removeItem('token')
            //2.重新跳转到登录页面
            location.href = '/login.html'
            //这是关闭弹出层
            layer.close(index);
          });
    })
})

//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success:function(res){
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //渲染用户的头像，调用renderAvatar()
            renderAvatar(res.data)
        }
        //不论成功还是失败，都会调用 complete 回调函数
        //防止用户在没有登录的情况下，直接进入到 index 页面中
        /* complete: function(res){
            console.log(res);
            // console.log('执行了回调函数！');

             // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //1. 强制清空token
                localStorage.removeItem('token')
                //2. 强制跳转到登录页面
                location.href = '/login.html'
            }
        } */
    })
}

//渲染用户的头像
function renderAvatar(user) {
    // console.log(user);
    var username = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;'+username);
    //判断用户有没有头像，如果有就显示头像，如果没有，就把用户名字的第一个字展示出来
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text_avatar').hide()
    }else {
        $('.layui-nav-img').hide();
        var firstName = username[0].toUpperCase()
        $('.text_avatar').html(firstName).show()
    }

}
