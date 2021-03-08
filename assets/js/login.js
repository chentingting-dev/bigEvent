$(function () {
    $('.link_reg').on('click', function () {
        // console.log(123);
        $('.login_box').hide();
        $('.reg_box').show();
    })
    $('.link_login').on('click', function () {
        // console.log(456);
        $('.login_box').show();
        $('.reg_box').hide();
    })

    // 从 layui 中获取 form 对象
    var form = layui.form
    // 用form对象调用verify函数
    form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        passwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repasswd: function (value) {
            var pwd = $('.reg_box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    //为form注册表单注册submit提交事件
    $('.form_reg').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        // 发起post请求
        var data = {
            username: $('.form_reg [name = username]').val(),
            password: $('.form_reg [name = password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            layui.layer.msg('注册成功，请登录！');
            //模拟人的点击行为
            $('.link_login').click();
        })
    })

    //为form登录表单注册submit提交事件
    $('.form_login').on('submit', function (e) {
        // console.log(123);
        e.preventDefault();
        // console.log(456);
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('登录失败！');
                }
                // console.log(789);
                layui.layer.msg('登录成功！');
                // console.log('abc');

                //将登录成功的token字符串保存到localStorage中
                localStorage.setItem('token', res.token);
                console.log(res.token);

                //跳转到后台主页
                location.href = '/index.html'
            }
        })
    })

})