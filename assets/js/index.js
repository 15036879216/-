//获取用户基本信息

function getUserInfo(){
    $.ajax({
        type:"GET",
        url:"/my/userinfo",
        //headers  固定写法，放在请求头里，用Authorization时写
        //改造进baseAPI中，这样之后就不用再手动添加了
        // headers: {
        //     Authorization: localStorage.getItem("token"),
        // },
        success:(res) => {
            if(res.status !== 0) return layer.msg("获取用户信息失败")
            // console.log(res);
            renderAvatar(res.data)
        },
        //退出后，依然能够访问index,这是不合理的 所以要控制用户的访问权限
        // complete:(res) => {
        //     if(res.responseJSON.status ===1 && res.responseJSON.message === "身份认证失败！"){
        //         localStorage.removeItem('token')
        //         location.href='/login.index'
        //     }
        // }
    })
}
getUserInfo();
//渲染用户信息到页面
const renderAvatar=(user) => {
    console.log(user);
    // email: ""
    // id: 12100
    // nickname: ""
    // user_pic: null
    // username: "snk"
    //只有user.username用user.username，还有user.nickname就用user.nickname
    let uname=user.nickname || user.username;
    $('#welcome').html(`欢迎 ${uname}`)
    //没有上传头像
    if(user.user_pic == null){
        $(".layui-nav-img").hide()
    $(".text-avatar").html(uname[0].toUpperCase())
    }else{
        //上传头像
        $(".layui-nav-img").attr('src',user.user_pic)
        $(".text-avatar").hide()
    }
}
//点击退出按钮， 移除本地的token
$("#btnLogout").on("click",function(){
    layui.layer.confirm("确定退出登录？",{ icon: 3, title: "" },
    function () {
        // 清空本地存储里面的 token
        localStorage.removeItem("token");
        // 重新跳转到登录页面
        location.href = "/login.html";
    })
        
    
})
function change(){
    $("#change").attr("class","layui-this").next().attr("class","")
}

