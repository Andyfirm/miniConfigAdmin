<template>
  <div class="edit_container">
     <quill-editor
       v-model="content"
       ref="QuillEditor"
       :options="editorOption"
       @change="onEditorChange($event)"
     ></quill-editor>
     <!-- 隐藏的上传图片标签 -->
     <el-upload
     class="uploadImg-text"
     ref="upload"
     :limit="1"
     :show-upload-list="false"
     :http-request="ImgUploadSectionFile"
     :on-error="fileError"
     :format="['jpg','jpeg','png','gif']"
     :max-size="2048"
     :multiple="false"
     :auto-upload="true"
     action=""
     >
     <Button icon="ios-cloud-upload-outline" ></Button>
   </el-upload>
   </div>
 </template>
 
 <script>
 import { Quill } from "vue-quill-editor"
 import { ImageDrop } from "../utils/ImageDrop.js"
 import ImageResize from "quill-image-resize-module"
 Quill.register("modules/imageDrop", ImageDrop)
 Quill.register("modules/imageResize", ImageResize)
 import config from "../configUrl.json"
 
 import {
  insertDescriptionImage,
  deleteDescriptionImage,
 } from "../api/index"
 
 //获取富文本所以图片的id和被删除图片id
 const getRemovImgId = (ids, html) => {
   let dom = document.createElement("DIV")
   dom.innerHTML = html
   const imgDom = dom.getElementsByTagName("img")
   const url = config.imgURL
   const arr = []
   for (let i = 0; i < imgDom.length; i++) {
     if (imgDom[i].src.indexOf(url) > -1) {
       let reg = new RegExp("(^|&)id=([^&]*)(&|$)");
       let r = imgDom[i].src.split("?")[1].match(reg);
       let id = unescape(r[2]);
       ids.splice(ids.indexOf(id), 1);
       arr.push(id);
     }
   }
   return {
     removeIds: ids,
     imgIds: arr,
   };
 };
 const toolbarOptions = [
   ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
   ['blockquote', 'code-block'],     //引用，代码块
   [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
   [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
   // [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
   // [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
   // [{ 'direction': 'rtl' }],             // 文本方向
   [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
   [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
   // [{ 'font': [] }],     //字体
   [{ 'align': [] }],    //对齐方式
   // ['clean'],    //清除字体样式
   ['image']    //上传图片、上传视频
 ]
 
 export default {
   name: "editoritem",
   data() {
     return {
       imgIds: [], //所有图片id
       removeIds: [], //被删除图片id
       content: ``,
       ////
       editorOption: {
         placeholder: '请输入内容...',
         modules: {
           imageResize: {
             displayStyles: {
               backgroundColor: "black",
               border: "none",
               color: "white",
             },
             modules: ["Resize", "DisplaySize", "Toolbar"],
           },
           toolbar: {
             container: toolbarOptions, // 工具栏
             handlers: {
               image: function (value) {
                 if (value) {
                   // 调用iview图片上传
                   document.querySelector(".el-upload.el-upload--text").click();
                 } else {
                   this.quill.format("image", false);
                 }
               },
             },
           },
         },
       },
     };
   },
   props: {
     value: {
       type: String,
       default: "",
     },
     type: {
       type: String,
       default: "",
     },
     id: {
       type: String,
       default: "",
     },
     delImgType: {
       type: Boolean,
       default: false,
     },
   },
   watch: {
     value: {
       handler() {
         this.content = this.value
       },
       immediate: true
     },
     content() {
       this.$emit("upDateText", this.content);
     },
     delImgType(type) {
       if (type && this.removeIds.length > 0) {
         this.delImg()
       }
     }
   },
   methods: {
     async ImgUploadSectionFile(uploadFile) {
       if (uploadFile.file.size / 1024 > 500) {
         this.$message.error("上传图片大小不能超过500kb")
         this.fileList = [];
         this.hideUpload = false
         return
       }
 
       if (uploadFile.file.name) {
         let nameARR = uploadFile.file.name.split(".")
         var re
         re = /^[A-Za-z0-9]+$/g;
         if (!re.test(nameARR[0])) {
           this.$message.error("上传图片名称只能是数字字母组合")
           this.fileList = []
           this.hideUpload = false
           return
         }
       }
       let formData = new FormData() //formdata格式
       formData.append("id", this.id)
       formData.append("type", this.type)
       formData.append("uploadFile", uploadFile.file)
       const res = await insertDescriptionImage(formData)
       this.handleSuccess(res)
     },
     handleSuccess(res) {
       // 获取富文本组件实例
       let quill = this.$refs.QuillEditor.quill
       // 如果上传成功
       if (res.msg === "success") {
         this.$refs.upload.clearFiles() //清空
         this.$message({
           type: "success",
           message: "图片上传成功",
         })
         // 获取光标所在位置
         let length = quill.getSelection().index
         // 插入图片，res为服务器返回的图片链接地址
         // let imgId = res.data.replace(/\//g, "").replace(/\./g, "")
         let imgId = res.data
         quill.insertEmbed(
           length,
           "image",
           `${config.imgURL}/images/${res.data}?id=${imgId}`
         );
         // 调整光标到最后
         quill.setSelection(length + 1)
         this.removeIds.forEach((item, index) => {
           if (item == imgId) {
             this.removeIds.splice(index, 1)
           }
         })
       } else {
         // 提示信息，需引入Message
         this.$message.error("图片插入失败")
       }
     },
     //上传失败
     fileError() {
       this.$message.error("图片上传失败")
     },
     // 删除已删除的图片
     async delImg() {
       await deleteDescriptionImage({
         id: this.id,
         type: this.type,
         imagePaths: this.removeIds.join()
       })
     },
     // 内容改变事件
     onEditorChange({ html }) {
       this.$emit("change", html)
       const ids = getRemovImgId(this.imgIds, html)
       this.imgIds = ids.imgIds;
       this.removeIds = [...this.removeIds, ...ids.removeIds]
     }
   },
 };
 </script>
 
 <style lang="scss">
 .uploadImg-text {
   display: none;
 }
 .ql-container.ql-snow {
  overflow-y: auto;
   min-height: 300px;
   max-height: 500px;
 }
 .edit_container {
   width: 375px;
   line-height: 0;
   padding-top: 10px;
 }
 .ql-snow .ql-picker-options .ql-picker-item {
   line-height: 20px;
 }
 </style>