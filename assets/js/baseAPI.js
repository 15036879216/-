// 每次请求的时候都需要去添加根路径，比较的麻烦，如果根路径进行了修改，那么每个请求的页面都需要调整，
// 所以jQuery中提供了一个过滤器，可以帮我们统一去进行设置，而这个过滤器调用的时机是在我们调用
// $.ajax() 之后，请求真正发给后台之前调用的： 
//​$.ajax() > ajaxPrefilter过滤器 -> 发送请求给服务器
$.ajaxPrefilter((option) =>{
    option.url="http://www.liulongbin.top:3007"+option.url
    //如果url中有'/my/'，就自动将标头添加进ajax中
    if(option.url.includes('/my/')){
        option.headers={
            Authorization: localStorage.getItem("token")
        }
    }
    option.complete=(res) => {
        if(res.responseJSON.status ===1 && res.responseJSON.message === "身份认证失败！"){
            localStorage.removeItem('token')
            location.href='/login.html'
        }
    }
})