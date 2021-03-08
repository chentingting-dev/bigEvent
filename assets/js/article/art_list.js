$(function () {
    var form = layui.form
    var laypage = layui.laypage;
    // 定义一个美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    function padZero(n) {
        return n > 10 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    // 获取文章列表数据的方法
    initTable()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败！');
                }
                // 使用模版引擎渲染列表页面
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的方法
    initCate()
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if (res.status !== 0) return layui.layer.msg('获得文章分类列表数据失败！');
                // 调用模版引擎渲染分类的可选项
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                // 通知 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit',function(e){
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 重新渲染
        initTable()
    })
    // 定义渲染分页的方法
    function renderPage(total){
        // console.log(total);
        laypage.render({
            elem: 'pageBox',//分页容器的id
            count: total, // 数据的总数
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, // 起始页
            layout: ['count','limit','prev','page','next','skip'],
            limits: [2,3,5,10],
            // 分页发生切换的时候，会触发 jump 回调
            //  触发jump回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了laypage.render()方法，就会触发jump回调
            jump: function(obj,first){
                // 可以通过 first 的值，来判断是通过哪种方式触发的jump回调
                console.log(obj.curr);
                // 把最新的页码值赋值到 q 这个查询参数对象中
                q.pagenum=obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize=obj.limit
                // 第一次的时候不执行（会造成死循环），当点击页码的时候重新调用initTable渲染当前页的数据
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 通过代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click','.btn-delete',function(){
        // 获取到id
        var id = $(this).attr('data-id')
        // 获取到删除按钮的个数
        var len = $('.btn-delete').length
        // 弹出层，询问用户是否要删除
        layer.confirm('确定删除吗？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/'+id,
                success: function(res){
                    if(res.status !== 0) return layui.layer.msg('删除文章失败！');
                    layui.layer.msg('删除文章成功！');
                    // 当数据删除完成后，需要判断当前页面是否还有剩余数据，如果没有数据，则让页码值-1，再重新调用initTable()
                    if (len === 1) {
                        // 如果len=1，则页面上没有任何数据了
                        // 页码值最小必须是1
                        q.pagenum=q.pagenum===1?1:q.pagenum-1
                    }
                    initTable()
                }
            })
            
            layer.close(index);
          });
    })
})