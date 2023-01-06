<template>
  <div id="LoginView">
    <div class="title-box">
      <img src="../assets/login/logo.png" alt="" class="logo">
      <div class="shu"></div>
      <div class="title">易思普智慧场馆综合管理平台</div>
    </div>
    <el-row class="contain">
      <el-col :span="12">
        <div class="left-box"><img src="../assets/login/aiot.png" alt=""></div>
      </el-col>
      <el-col :span="12" class="center-right">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-position="left"
          label-width="0px"
          class="login-container"
        >
          <h4 class="title2">用户登录</h4>
          <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户密码登录" name="userTab">
              <el-form-item>
                <el-input
                  class="inputStyle"
                  type="text"
                  size="large"
                  prefix-icon="el-icon-user-solid"
                  v-model="ruleForm.userName"
                  auto-complete="off"
                  placeholder="用户名"
                ></el-input>
              </el-form-item>
              <el-form-item style="margin-top: 30px">
                <el-input
                  class="inputStyle"
                  type="password"
                  size="large"
                  prefix-icon="el-icon-lock"
                  v-model="ruleForm.password"
                  auto-complete="off"
                  placeholder="密码"
                ></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="手机验证码登录" name="phoneTab">
              <el-form-item>
                <el-input
                  class="inputStyle inputPhone"
                  type="text"
                  size="large"
                  v-model="ruleForm.mobile"
                  auto-complete="off"
                  placeholder="请输入手机号"
                ></el-input>
                <el-col class="phineTitle">+86</el-col>
              </el-form-item>
              <el-form-item style="margin-top: 30px">
                <el-input
                  class="inputStyle"
                  size="large"
                  v-model="ruleForm.vCode"
                  auto-complete="off"
                  placeholder="请输入验证码"
                ></el-input>
                <el-button
                  class="subBtn getCode"
                  :disabled="
                    ruleForm.mobile.length == 11 ? !disableBtn : disableBtn
                  "
                  @click="getCode(ruleForm.mobile)"
                  >{{ btnMsg }}</el-button
                >
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          <!-- <el-checkbox v-model="checked" checked></el-checkbox>
          <span :class="this.checked ? 'remember rememberActive' : 'remember'"
            > 我已经阅读并同意《用户协议》</span
          > -->
          <el-form-item style="width:100%;margin:10px 0 40px;">
            <el-button
              class="subBtn"
              style="width: 100%; margintop: 10px"
              @click="handleSubmit"
              :loading="logining"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { login, mobileLogin, getVCode } from '../api/index'
export default {
  name: 'LoginView',
  data() {
    return {
      logining: false,
      ruleForm: {
        userName: '',
        password: '',
        mobile: '',
        vCode: ''
      },
      rules: {
        userName: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      },
      btnMsg: '获取验证码',
      activeName: 'userTab',
      loginType: 1,
      checked: true,
      numbres: 60,
      disableBtn: true
    }
  },
  created() {
    var _self = this
    document.onkeydown = function () {
      var key = window.event.keyCode
      if (key == 13) {
        _self.handleSubmit()
      }
    }
    if (localStorage.getItem('userName')) {
      this.ruleForm.userName = localStorage.getItem('userName')
      this.ruleForm.password = localStorage.getItem('password')
    }
  },
  methods: {
    handleClick(tab) {
      if (tab.name === 'userTab') {
        this.loginType = 1
        if (localStorage.getItem('userName')) {
          this.ruleForm.userName = localStorage.getItem('userName')
          this.ruleForm.password = localStorage.getItem('password')
        }
        this.ruleForm.mobile = ''
        this.ruleForm.vCode = ''
      } else {
        this.loginType = 2
        this.ruleForm.userName = ''
        this.ruleForm.password = ''
      }
    },
    async getCode(mobile) {
      let res = await getVCode({ mobile })
      if (res.msg === 'success') {
        this.$message({
          type: "success",
          message: "获取验证码成功"
        })
        let setInt = setInterval(() => {
          this.numbres--
          if (this.numbres == 0) {
            this.btnMsg = '获取验证码'
            this.numbres = 60
            this.disableBtn = true
            clearInterval(setInt)
          } else {
            this.disableBtn = false
            this.btnMsg = this.numbres + '(s)重新获取'
          }
        }, 1000)
      } else {
        this.$message({
          type: "error",
          message: res.data
        })
      }
    },
    handleSubmit() {
      if (!this.checked) {
        return this.$message({
          message: "请先阅读并同意协议",
          type: "error"
        })
      }
      if (this.loginType === 1) {
        let eles = []
        this.ruleForm.mobile = ''
        this.ruleForm.vCode = ''
        eles.push(this.ruleForm.password)
        this.password = this.common.encode('0x12', eles)
      } else {
        this.ruleForm.userName = null
        this.ruleForm.password = null
      }
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.logining = true
          if (this.loginType === 1) {
            localStorage.setItem('userName', this.ruleForm.userName)
            localStorage.setItem('password', this.ruleForm.password)
            const res = await login({
              userName: this.ruleForm.userName,
              password: this.password
            })
            this.logining = false
            if (res.msg === 'success') {
              sessionStorage.setItem('userinfo', JSON.stringify(res.data))
              sessionStorage.setItem('shopNum', res.data.shopNum)
              sessionStorage.setItem('token', res.data.token)
              sessionStorage.removeItem('flag')
              this.$router.push('/')
            } else {
              this.$message({
                message: res.data,
                type: 'error'
              })
            }
          } else {
            const res = await mobileLogin(this.ruleForm)
            this.logining = false
            if (res.msg === 'success') {
              sessionStorage.setItem('userinfo', JSON.stringify(res.data))
              sessionStorage.setItem('shopNum', res.data.shopNum)
              sessionStorage.setItem('token', res.data.token)
              sessionStorage.removeItem('flag')
              this.$router.push('/')
            } else {
              this.$message({
                message: res.data,
                type: 'error'
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
#LoginView {
  width: 100%;
  height: 100%;
  background: url("../assets/login/background.png") no-repeat center/cover;
  .title-box {
    display: flex;
    align-items: center;
    padding: 60px 80px;
    box-sizing: border-box;
    .logo {
      width: 110px;
    }
    .shu {
      width: 2px;
      height: 30px;
      background-color: #fff;
      margin: 0 10px;
    }
    .title {
      font-size: 24px;
      color: #fff;
    }
  }
  .contain {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    .left-box {
      width: 60%;
      margin: 0 auto;
      img {
        width: 100%;
        display: block;
      }
    }
    .center-right {
      width: 25%;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      background: url("../assets/login/loginBorder.png");
      background-size: 100% 100%;
      .login-container {
        width: 80%;
        box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06),
          0 1px 0px 0 rgba(0, 0, 0, 0.02);
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        .title2 {
          margin: 2.4rem 0;
          text-align: center;
          font-size: 1.4rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }
      .subBtn {
        font-size: 20px;
        background: linear-gradient(
          0deg,
          rgba(1, 119, 228, 1),
          rgba(0, 184, 255, 1)
        );
        border: none;
        border-radius: 6px;
        color: #fff;
      }
      .remember {
        margin: 20px 0px 35px 0px;
        color: #ffffff;
      }
      .rememberActive {
        // margin: 20px 0px 35px 0px;
        color: #0185ea;
      }
    }
    .inputStyle {
      font-size: 16px;
      line-height: 40px;
      position: relative;
    }
    .inputPhone .el-input__inner {
      padding-left: 50px;
    }
    .phineTitle {
      color: #fff;
      font-size: 16px;
      width: 50px;
      text-align: center;
      position: absolute;
      left: 0;
      top: 0;
    }
    input {
      background: none;
      color: #fff;
      border-color: #00d2ff;
    }
    .getCode {
      width: 100px;
      height: 25px;
      font-size: 12px !important;
      line-height: 25px;
      position: absolute;
      left: 200px;
      top: 7px;
      padding: 0;
      background: linear-gradient(0deg, #0177e4, #00b8ff);
      border-radius: 4px !important;
    }
    .el-tabs__nav-wrap {
      overflow: hidden;
      margin-bottom: -1px;
      position: relative;
      background: none;
      padding: 0;
      color: #fff;
      font-size: 16px;
    }
    .el-tabs__nav {
      float: none;
    }
    #tab-userTab {
      width: 50%;
      text-align: center;
    }
    #tab-phoneTab {
      text-align: center;
    }
    .el-tabs__item {
      color: #ccc;
      width: 50%;
      font-size: 16px;
      padding: 0;
    }
    .is-active {
      color: #ffffff !important;
    }
    .el-tabs__active-bar {
      position: absolute;
      bottom: 0;
      left: 32px;
      height: 2px;
      width: 100px !important;
      background-color: #00b8ff;
      z-index: 1;
    }
    .el-tabs__nav-wrap::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0 !important;
      height: 2px;
      background-color: #e4e7ed;
      z-index: 1;
    }
  }
}
</style>