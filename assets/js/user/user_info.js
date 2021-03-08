$(function(){
    // 验证表单信息
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value){
            if(value.length > 6){
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })
    //初始化用户的基本信息
    initUserInfo()
    function initUserInfo(){
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res){
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                //调用form.val()为表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }

    //重置表单的数据
    $('#btnReset').on('click',function(e){
        e.preventDefault();
        initUserInfo()
    })

    //form表单提交修改信息
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res){
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                //调用父页面中的getUserInfo(),重新渲染用户的头像和用户的信息
                // 注意：getUserInfo()一定要是全局下的函数，才能用window调用
                window.parent.getUserInfo()
            }
        })
    })
})