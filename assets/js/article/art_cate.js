$(function () {
    const initArtCateList = () => {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: (res) => {
                //调用template函数
                const htmlStr = template("tpl-table", res)
                $("tbody").empty().html(htmlStr)
            }
        })
    }
    initArtCateList()
    const layer = layui.layer;
    let indexAdd = null
    $("#btnAddCate").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $('#dialog-add').html()
        });

    })
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg("请求失败")
                layer.msg("新增文章分类成功")
                initArtCateList()
                layer.close(indexAdd)
            }
        })
    })

    let indexEdit = null
    $("tbody").on("click", ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html(),
        });
        const id = $(this).attr("data-id");
        // 发起请求获取对应分类的数据
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                layui.form.val("form-edit", res.data);
            },
        });
    })
    // 更新文章分类
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("更新分类数据失败！");
                }
                layer.msg("更新分类数据成功！");
                layer.close(indexEdit);
                initArtCateList();
            },
        });
    });


    //删除文章分类
    $("tbody").on("click", ".btn-delete", function () {
        const id = $(this).attr("data-id")
        layer.confirm(
            "是否删除？",
            { icon: 3, title: "删除分类" },
            function (index) {
                $.ajax({
                    type: "GET",
                    url: "/my/article/deletecate/" + id,
                    success: (res) => {
                        console.log(res);
                        if (res.status !== 0) return layer.msg("删除文章分类失败")
                        layer.msg("删除文章分类成功")
                        layer.close(index)
                        initArtCateList()
                    }
                })
            }
        )
    })

})
