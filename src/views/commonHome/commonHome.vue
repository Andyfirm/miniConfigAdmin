<template>
  <div id="commonHome">
    <el-row class="web">
      <el-row class="logo">
        <img style="width:380px;" src="../../assets/logoBG.png" alt="">
      </el-row>
      <el-row class="title">
        欢迎使用易思普综合管理平台
      </el-row>
      <el-dialog title="修改密码" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" :visible.sync="dialogVisible" width="30%">
        <el-form :model="formparam" :rules="rules" ref="formparam" label-width="80px">
          <el-form-item label="密码" prop="password">
            <el-input class="w220" v-model="formparam.password" placeholder="请输入6-10位字母数字结合的密码"></el-input>
          </el-form-item>
          <el-col style="marginLeft:30px">*当前密码为初始密码，为了账户安全请输入密码</el-col>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button style="width:100px" type="primary" @click="submitSetInfo('formparam')">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { getShops, updatePassword } from '../../api/index'
export default {
  name: 'commonHome',
  data() {
    return {
      state: '',
      role: '',
      dialogVisible: false,
      rules: {
        password: [
          {
            required: true,
            min: 6,
            max: 10,
            message: "请输入6-10位字母数字结合的密码",
          }, 
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/,
            message: "请输入6-10位字母数字结合的密码",
            trigger: 'change'
          }
        ]
      },
      password:'',
      formparam: {
        password: ""
      }
    }
  },
  mounted() {
    this.state = JSON.parse(sessionStorage.getItem('userinfo')).state
    this.role = JSON.parse(sessionStorage.getItem('userinfo')).role
    if(this.state == 0){
      this.dialogVisible = true
    }
    if(this.role!='root'){
      this.getShopsList()
    }
  },
  methods: {
    //查询场馆类型
    async getShopsList() {
      const res = await getShops({isWeb: 1})
      if (res === 'success') {
        sessionStorage.setItem("shopList", JSON.stringify(res.data))
      }
    },
    submitSetInfo(formparam) {
      this.password = this.formparam.password
      let eles = [this.password]
      this.password = this.common.encode("0x12",eles)
      this.$refs[formparam].validate(async valid => {
        if (valid) {
          const res = await updatePassword({password: this.password})
          if (res.msg == "success") {
            this.dialogVisible = false
            this.$message({
              type: "success",
              message: "修改成功，请重新登录"
            })
            setTimeout(() => {
              sessionStorage.clear()
              sessionStorage.setItem("flag", 0)
              this.$router.push({ path: "/login" })
            }, 2000)
          } else {
            this.$message({
              type: "error",
              message: res.data
            })
          }
        } else {
          return this.$message.error("请检查必填项")
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#commonHome {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.logo{
  text-align: center;
  img{
    margin: 0 auto;
  }
}
.dialogtitle{
  text-align: center
}
.title{
  font-size: 36px;
  text-align: center;
  color: #ccc;
}
</style>