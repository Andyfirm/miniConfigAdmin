<template>
  <div id="nav-top">
    <div class="left-box">
      <el-button class="zhedie" icon="el-icon-s-fold" size="mini" v-show="!isCollapse" @click="setiscollspase"></el-button>
      <el-button class="zhedie" icon="el-icon-s-unfold" size="mini" v-show="isCollapse" @click="setiscollspase"></el-button>
    </div>
    <div class="right-box">
      <div class="user-box">
        <i class="el-icon-user-solid"></i>
        <el-dropdown>
        <span class="el-dropdown-link">
          您好，{{sysUserName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item  @click.native="changePassword">修改密码</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </div>
      <div class="exit-box" @click="logout">
        <i class="el-icon-switch-button"></i>
        <span>退出</span>
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="formparam"
        :rules="rules"
        ref="formparam"
        label-width="80px"
      >
        <el-form-item label="密码" prop="password">
          <el-input
            style="width: 300px"
            v-model="formparam.password"
            placeholder="6-10位数组字母结合密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button 
         style="width: 100px"
         @click="resetForm('formparam')"
          >取 消</el-button
        >
        <el-button
          style="width: 100px"
          type="primary"
          @click="submitSetInfo('formparam')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updatePassword } from '../api/index'
export default {
  name: 'NavTop',
  data() {
    return {
      sysUserName: '',
      dialogVisible: false,
      formparam: {
        password: ''
      },
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
            trigger: "change"
          }
        ]
      },
      password: ''
    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.user.isCollapse
    }
  },
  mounted() {
    var userinfo = JSON.parse(sessionStorage.getItem("userinfo"))
    if (userinfo) {
      this.sysUserName = userinfo.userName
    }
  },
  methods: {
    setiscollspase() {
      this.$store.commit('SET_ISCOLLAPSE')
    },
    //修改密码
    changePassword() {
      this.dialogVisible = true
      this.formparam.password = ''
      this.password = ''
    },
    submitSetInfo(formparam) {
      this.$refs[formparam].validate(async (valid) => {
        if (valid) {
          let eles = [this.formparam.password]
          this.password = this.common.encode("0x12", eles)
          const res = await updatePassword({ password: this.password })
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
    },
    resetForm(formparam) {
      this.dialogVisible = false
      this.$refs[formparam].clearValidate()
      this.$refs[formparam].resetFields()
    },
    // 退出登录
    logout() {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      }).then(() => {
        sessionStorage.clear()
        sessionStorage.setItem("flag", 0)
        this.$router.push("/login")
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#nav-top {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    .left-box {
      .zhedie {
        font-size: 18px;
        color: #333;
        padding: 5px 8px;
        margin: 0;
      }
    }
    .right-box {
      display: flex;
      align-items: center;
      .user-box {
        margin-right: 40px;
        i {
          margin-right: 4px;
          font-size: 16px;
          color: #666;
        }
        .el-dropdown-link {
          cursor: pointer;
          color: #666;
        }
        .el-icon-arrow-down {
          font-size: 12px;
        }
      }
      .exit-box {
        i {
          margin-right: 4px;
          font-size: 16px;
          color: #666;
        }
        span {
          color: #666;
          font-size: 14px;
        }
      }
    }
  }
</style>
