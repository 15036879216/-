$(function(){
    
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q={
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 5, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的发布状态
    };
    //获取文章列表
    const initTable=() => {
        $.ajax({
            type:"GET",
            url:"/my/article/list",
            data:q,
            success:(res) =>{
                if(res.status !== 0) return layer.msg("获取文章列表失败！")
                const htmlStr=template("tpl-table",res)
                $("tbody").html(htmlStr)
                // console.log(res);
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    initTable()
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //将分类数据渲染到下拉列表中
    const form = layui.form
    const initCate=() => {
        $.ajax({
            type:"GET",
            url:"/my/article/cates",
            success:(res) => {
                // console.log(res);
                if(res.status !== 0) return  layer.msg("获取分类数据失败！")
                const htmlStr=template("tpl-cate",res)
                $(".layui-form [name=cate_id]").html(htmlStr)
                form.render("select")
            }
        })
    }
    initCate()
    //点击筛选按钮
    $("#form-search").on("submit",function(e){
        e.preventDefault()
        q.cate_id=$("#form-search [name=cate_id]").val()
        q.state=$("#form-search [name=state]").val()
        console.log(q);
        initTable()
    })

    // 定义渲染分页方法
    
    const laypage=layui.laypage
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum ,// 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
            // 第一次进来，首次点击first为true，此时不进initTable()函数，再点击下一页，不为true,进入initTable()
            //
            jump: function(obj,first) {
                console.log(first);//首次进来 true
                // console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // console.log();
                //确保每次切换的时候调用
                if(!first){
                    initTable()
                    // console.log('false');
                }
            }
        })
    }
    //删除
    $("tbody").on("click",'.btn-delete',function(){
        const length=$('.btn-delete').length
        var id=$(this).attr("data-id")
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0)  return layer.msg('删除文章失败！')
                    layer.msg('删除文章成功！')
                    if(length == 1)  {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum-1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
    
    //点击编辑，把原有的渲染出来
    // $("tbody").on("click",'.btn-edit',function(){
    //     console.log('sdfghjk');
    //     //跳转到发布文章页面

    // })
})