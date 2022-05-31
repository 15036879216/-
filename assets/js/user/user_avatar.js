$(function(){


// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
  // 纵横比
  aspectRatio: 1,
  // 指定预览区域
  preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

$("#btnChooseImage").on("click",function(){
    $('#file').click()
})
$('#file').change((e) => {
    //获取上传的文件的长度
    const filelength=e.target.files.length
    if(filelength === 0) return
    //找到第一个
    const file=e.target.files[0]
    //window自带的，返回地址
    const imgUrl=URL.createObjectURL(file)
    console.log(imgUrl);//blob:http://127.0.0.1:5500/3d0a1ac6-167b-4c50-b586-254809c8085d
    // 插件
    $image
    .cropper("destroy") // 销毁旧的裁剪区域
    .attr("src", imgUrl) // 重新设置图片路径
    .cropper(options); // 重新初始化裁剪区域
});
$("#btnUpload").on("click",function(){
    // 1、拿到用户裁切之后的头像
    // 直接复制代码即可
    const dataURL = $image
    .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
    })
    .toDataURL("image/png");
    $.ajax({
        type:"POST",
        url:"/my/update/avatar",
        data:{
            avatar: dataURL
        },
        success:(res) => {
            if(res.status !== 0) return layer.msg("上传头像失败")
            layer.msg("上传头像成功")
            window.parent.getUserInfo()
        }
    })
})
})