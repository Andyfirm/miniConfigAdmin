<template>
  <div id="venue">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h1>基础信息</h1>
      </div>
      <el-row>
        <el-col :span="8">
          <el-row class="li">
            <el-col :span="8" class="title">商户名称：</el-col>
            <el-col :span="14" class="text">{{ venueInfo.venueName }}</el-col>
          </el-row>
          <el-row class="li">
            <el-col :span="8" class="title">会员端平台名称：</el-col>
            <el-col :span="14" class="text">{{ venueInfo.chineseName }}</el-col>
          </el-row>
          <el-row class="li">
            <el-col :span="8" class="title">会员端平台简称：</el-col>
            <el-col :span="14" class="text">{{ venueInfo.englishName }}</el-col>
          </el-row>
          <el-row class="li">
            <el-col :span="8" class="title">商户logo：</el-col>
            <el-col :span="14" class="text">
              <img style="width:24px;" :src="imgURL + '/images/' + this.venueInfo.logo" alt="" />
            </el-col>
          </el-row>
          <el-row class="li">
            <el-col :span="24" class="title">商户介绍（首页展示）：</el-col>
            <el-col :span="24" class="jieshao text">
              <div v-html="venueInfo.info"></div>
            </el-col>
          </el-row>
          <el-button
            class="edit-btn"
            type="primary"
            size="small"
            @click="edit"
            v-if="addType === 1"
            >编辑</el-button
          >
          <el-button
            class="edit-btn"
            type="success"
            size="small"
            @click="addBtn"
            v-if="addType === 2"
            >新增</el-button
          >
        </el-col>
        <el-col :span="16">
          <el-row>
            <el-col :span="8">
              <div class="img-box-wrap">
                <div class="img-name">启动页</div>
                <div class="img-box">
                  <img
                    class="imgLogoyulan"
                    :src="imgURL + '/images/' + imgList.startimage"
                    alt=""
                  />
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="img-box-wrap">
                <div class="img-name">会员端登录页</div>
                <div class="img-box">
                  <img
                    class="imgLogoyulan"
                    :src="imgURL + '/images/' + this.imgList.memberloginimage"
                    alt=""
                  />
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="img-box-wrap">
                <div class="img-name">员工端登录页</div>
                <div class="img-box">
                  <img
                    class="imgLogoyulan"
                    :src="imgURL + '/images/' + this.imgList.employeeloginimage"
                    alt=""
                  />
                </div>
              </div>
            </el-col>
          </el-row>
          <el-button class="edit-btn deit-img" type="primary" size="small" @click="edit2"
            >编辑</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="设置" :visible.sync="dialogVisible" width="800px">
      <el-form
        :model="venueInfo"
        ref="venueInfo"
        :rules="rules"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="商户名称" prop="venueName" v-if="type == 1">
              <el-input
                v-model="venueInfo.venueName"
                placeholder="请输入商户名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会员端平台名称" v-if="type == 1">
              <el-input
                v-model="venueInfo.chineseName"
                type="text"
                placeholder="请输入会员端平台名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="会员端平台简称" v-if="type == 1">
              <el-input
                v-model="venueInfo.englishName"
                type="text"
                placeholder="请输入会员端平台简称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="商户简介" prop="info" v-if="type == 1">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="venueInfo.info">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="商户logo" ref="uploadElement" v-if="type == 1">
              <el-upload
                :class="{ uploaderNone: hideUpload4 }"
                action="aa"
                ref="upload4"
                list-type="picture-card"
                :auto-upload="false"
                :http-request="uploadFile4"
                :file-list="fileList4"
                multiple
                :limit="1"
                :on-change="onChange4"
                :on-remove="handleRemove4"
                accept="image/png,image/gif,image/jpg,image/jpeg"
              >
                <!-- <i class="el-icon-plus"></i> -->
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              *提示*：为了更好的用户体验，图片请提供150*150像素，文件大小不超过200kb。
            </el-form-item>
            <el-form-item
              label="启动背景图"
              ref="uploadElement"
              v-if="type == 2"
            >
              <el-upload
                :class="{ uploaderNone: hideUpload }"
                action="aa"
                ref="upload"
                list-type="picture-card"
                :auto-upload="false"
                :http-request="uploadFile"
                :file-list="fileList"
                multiple
                :limit="1"
                :on-change="onChange"
                :on-remove="handleRemove"
                accept="image/png,image/gif,image/jpg,image/jpeg"
              >
                <!-- <i class="el-icon-plus"></i> -->
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              *提示*：为了更好的用户体验，图片请提供750*1334像素，文件大小不超过200kb。
            </el-form-item>
            <el-form-item
              label="会员登录背景图"
              ref="uploadElement"
              v-if="type == 2"
            >
              <el-upload
                :class="{ uploaderNone: hideUpload2 }"
                action="aa"
                ref="upload2"
                list-type="picture-card"
                :auto-upload="false"
                :http-request="uploadFile2"
                :file-list="fileList2"
                multiple
                :limit="1"
                :on-change="onChange2"
                :on-remove="handleRemove2"
                accept="image/png,image/gif,image/jpg,image/jpeg"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              *提示*：为了更好的用户体验，图片请提供750*1334像素，文件大小不超过500kb。
            </el-form-item>
            <el-form-item
              label="员工登录背景图"
              ref="uploadElement"
              v-if="type == 2"
            >
              <el-upload
                :class="{ uploaderNone: hideUpload3 }"
                action="aa"
                ref="upload3"
                list-type="picture-card"
                :auto-upload="false"
                :http-request="uploadFile3"
                :file-list="fileList3"
                multiple
                :limit="1"
                :on-change="onChange3"
                :on-remove="handleRemove3"
                accept="image/png,image/gif,image/jpg,image/jpeg"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              *提示*：为了更好的用户体验，图片请提供750*1334像素，文件大小不超过500kb。
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">取 消</el-button>
        <el-button type="primary" @click="submitForm('venueInfo')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomerInfo, updateCustomerInfo, insertCustomerInfo, updateLoginImagefo, getLoginImagefo } from '../../api/index'
import config from '../../configUrl.json'
export default {
  name: 'venue',
  data() {
    return {
      imgURL: config.imgURL,
      venueInfo: {},
      addType: 1,
      type: 1,
      dialogVisible: false,
      hideUpload: false,
      hideUpload2: false,
      hideUpload3: false,
      hideUpload4: false,
      fileList: [], //图片列表
      fileList2: [],
      fileList3: [],
      fileList4: [],
      imgList: [],
      rules: {
        venueName: [
          { required: true, message: "请输入商户名称", trigger: "blur" },
        ],
        info: [{ required: true, message: "请输入商户说明", trigger: "blur" }]
      },
      formData: {}
    }
  },
  mounted() {
    this.getCustomerInfo()
    this.getLoginImagefo()
  },
  methods: {
    async getCustomerInfo() {
      const res = await getCustomerInfo()
      if (res.msg === "success") {
        if (res.data) {
          this.venueInfo = res.data
          this.addType = 1
        } else {
          this.addType = 2
        }
      } else {
        this.$message.error(res.data)
      }
    },
    async getLoginImagefo() {
      const res = await getLoginImagefo()
      if (res.msg === "success") {
        if (res.data) {
          this.imgList = res.data
        }
      } else {
        this.$message.error(res.data)
      }
    },
    handleRemove(fileList) {
      this.hideUpload = fileList.length >= this.fileList.length
    },
    handleRemove2(fileList) {
      this.hideUpload2 = fileList.length >= this.fileList2.length
    },
    handleRemove3(fileList) {
      this.hideUpload3 = fileList.length >= this.fileList3.length
    },
    handleRemove4(fileList) {
      this.hideUpload4 = fileList.length >= this.fileList4.length
    },
    onChange(file, fileList) {
      this.hideUpload = fileList.length <= this.fileList.length
    },
    onChange2(file, fileList) {
      this.hideUpload2 = fileList.length <= this.fileList2.length
    },
    onChange3(file, fileList) {
      this.hideUpload3 = fileList.length <= this.fileList3.length
    },
    onChange4(file, fileList) {
      this.hideUpload4 = fileList.length <= this.fileList4.length
    },
    uploadFile(file) {
      this.formData.append("startImage", file.file)
    },
    uploadFile2(file) {
      this.formData.append("memberLoginImage", file.file)
    },
    uploadFile3(file) {
      this.formData.append("employeeLoginImage", file.file)
    },
    uploadFile4(file) {
      this.formData.append("logFile", file.file)
    },
    edit() {
      this.type = 1
      this.fileList4 = []
      this.fileList4.push({ url: this.imgURL + "/images/" + this.venueInfo.logo })
      if (this.fileList4) {
        this.hideUpload4 = true
      } else {
        this.hideUpload4 = false
      }
      this.dialogVisible = true
    },
    edit2() {
      this.fileList = []
      this.fileList2 = []
      this.fileList3 = []
      this.fileList.push({
        url: this.imgURL + "/images/" + this.imgList.startimage
      });
      this.fileList2.push({
        url: this.imgURL + "/images/" + this.imgList.memberloginimage
      });
      this.fileList3.push({
        url: this.imgURL + "/images/" + this.imgList.employeeloginimage
      });
      if (this.fileList2) {
        this.hideUpload2 = true
      } else {
        this.hideUpload2 = false
      }
      if (this.fileList) {
        this.hideUpload = true
      } else {
        this.hideUpload = false
      }
      if (this.fileList3) {
        this.hideUpload3 = true
      } else {
        this.hideUpload3 = false
      }
      this.dialogVisible = true
      this.type = 2
    },
    addBtn() {
      this.fileList4 = []
      this.dialogVisible = true
      this.addType = 2
      this.type = 1
    },
    resetForm() {
      this.dialogVisible = false
    },
    submitForm(venueInfo) {
      this.$refs[venueInfo].validate(async (valid) => {
        if (valid) {
          this.formData = new FormData()
          if (this.type === 1) {
            this.$refs.upload4.submit()
            this.formData.append("venueName", this.venueInfo.venueName)
            if (!this.venueInfo.chineseName) {
              this.venueInfo.chineseName = ""
            }
            if (!this.venueInfo.englishName) {
              this.venueInfo.englishName = ""
            }
            this.formData.append("chineseName", this.venueInfo.chineseName)
            this.formData.append("englishName", this.venueInfo.englishName)
            this.formData.append("info", this.venueInfo.info)
            if (this.addType === 1) {
              const res = await updateCustomerInfo(this.formData)
              if (res.data.msg === "success") {
                this.dialogVisible = false
                this.$message({
                  type: "success",
                  message: "修改成功"
                })
                this.getCustomerInfo()
              } else {
                this.$message.error(res.data)
              }
            } else {
              const res = await insertCustomerInfo(this.formData)
              if (res.data.msg === "success") {
                this.dialogVisible = false
                this.$message({
                  type: "success",
                  message: "新增成功"
                })
                this.getCustomerInfo()
              } else {
                this.$message.error(res.data)
              }
            }
          } else {
            this.$refs.upload.submit()
            this.$refs.upload2.submit()
            this.$refs.upload3.submit()
            const res = await updateLoginImagefo(this.formData)
            if (res.data.msg === "success") {
              this.dialogVisible = false
              this.$message({
                type: "success",
                message: "修改成功"
              })
              this.getLoginImagefo()
            } else {
              this.$message.error(res.data)
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#venue {
  width: 100%;
  height: 100%;
  .box-card {
    height: 100%;
    h1 {
      text-align: left;
      font-size: 16px;
    }
    .li {
      padding: 20px;
      border-bottom: 1px solid #efefef;
    }
    .title {
      font-size: 14px;
      font-weight: 600;
    }
    .text {
      font-size: 14px;
    }
    .jieshao {
      margin-top: 20px;
      div {
        max-height: 240px;
        overflow-y: scroll;
        font-size: 14px;
        letter-spacing: 1px;
      }
      div::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #efefef;
        border-radius: 8px;
      }
    }
    .edit-btn {
      margin-top: 20px;
    }
    .deit-img {
      margin: 0 auto;
      display: block;
    }
    .img-box-wrap {
      text-align: center;
      margin: 0 auto;
      .img-box {
        width: 240px;
        height: 420px;
        background: #efefef;
        margin: 10px auto;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>