<template>
  <div id="userInfo">
    <el-card class="box-card">
      <search-top
        :showTypeObj="showTypeObj"
        @changeQuery="queryList"
        @showDialog="showDialog"
      ></search-top>
      <!-- 表格 -->
      <el-row class="tableList">
        <el-table
          v-loading="loading"
          :data="tableData"
          height="69vh"
          stripe
        >
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column label="场馆" width="300">
          <template slot-scope="scope">
            <div v-if="scope.row.shopNum">
              {{ getShopName(scope.row.shopNum) }}
            </div>
            <div v-else>管理中心</div>
          </template>
        </el-table-column>
          <el-table-column label="账号" prop="username"></el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="remark"></el-table-column>
          <el-table-column label="操作" width="360">
            <template slot-scope="scope">
              <el-button
              type="primary"
              size="mini"
              @click="edit(scope.row)"
              >修改密码</el-button
            >
            <el-button
              v-if="scope.row.role != role"
              type="primary"
              size="mini"
              @click="edit2(scope.row)"
              >修改角色</el-button
            >
            <el-button type="warning" size="mini" @click="edit3(scope.row)"
              >修改手机号</el-button
            >
            <el-button
              v-if="scope.row.role != role"
              type="danger"
              size="mini"
              @click="removData(scope.row)"
              >删除</el-button
            >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页 -->
      <el-row>
        <el-col :offset="14" :span="10">
          <el-pagination
            style="float: right; margin-top: 20px"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[20, 40, 80, 100]"
            :page-size="20"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :title="this.title" :visible.sync="dialogVisible" width="1000px">
      <el-form
        :model="formparam"
        :rules="rules"
        ref="formparam"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="分店" prop="shopNum" v-if="addType == 1">
              <el-select
                v-model="formparam.shopNum"
                placeholder="请选择"
                @change="changeShop(formparam.shopNum)"
              >
                <el-option
                  v-for="item in this.shopList"
                  :key="item.shopNum"
                  :label="item.name"
                  :value="item.shopNum"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop="userName" v-if="addType == 1">
              <el-input
                class="w220"
                v-model="formparam.userName"
                placeholder="请输入登录账号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码" prop="password" v-if="addType == 2">
              <el-input
                class="w220"
                v-model="formparam.password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色" v-if="addType == 1 || addType == 4">
              <el-select v-model="formparam.role" placeholder="请选择">
                <el-option
                  v-for="item in this.roles"
                  :key="item.role"
                  :label="item.remark"
                  :value="item.role"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="手机号"
              prop="mobile"
              v-if="addType == 1 || addType == 3"
            >
              <el-input
                class="w220"
                v-model="formparam.mobile"
                maxlength="11"
                placeholder="请输入用户手机号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验证码" prop="vCode" v-if="addType == 3">
              <el-input
                class="w220"
                v-model="formparam.vCode"
                maxlength="6"
                placeholder="请输入验证码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="addType == 3">
            <el-button
              :disabled="formparam.mobile.length == 11 ? !disableBtn : disableBtn"
              style="margin-left: 10px"
              type="primary"
              @click="getCode(formparam.mobile)"
              >{{ btnMsg }}</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button style="width: 100px" @click="resetForm('formparam')"
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
import { getUser, searchRole, UsergetVCode, empldeleteUser, insertUser, updateUser, updateUserMobile, updateUserRole } from '../../api/index'
import SearchTop from '@/components/SearchTop.vue'
export default {
  name: 'userInfo',
  data() {
    return {
      showTypeObj: {
        shopNum: true
      },
      params: {
        shopNum: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      currentPage: 1,
      loading: true,
      dialogVisible: false,
      addType: 1,
      tableData: [],
      password: '',
      formparam: {
        userName: '',
        shopNum: '',
        role: '',
        password: '',
        mobile: '',
        vCode: null,
      },
      roles: [], //角色列表
      role: JSON.parse(sessionStorage.getItem("userinfo")).role,
      title: '',
      numbres: 60,
      btnMsg: "获取验证码",
      disableBtn: true,
      rules: {
        userName: [
          {
            required: true,
            min: 6,
            max: 10,
            message: "请输入6-10位字母或字母数字结合的账号",
          },
          {
            pattern: /^(?![0-9]+$)[0-9A-Za-z]{6,10}$/,
            message: "请输入6-10位字母或字母数字结合的账号",
            trigger: "blur",
          },
        ],
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
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机格式",
            trigger: "blur",
          },
        ],
        vCode: [
          {
            required: true,
            pattern: /^\d{6}$/,
            message: "请输入正确的验证",
            trigger: "blur",
          },
        ],
        shopNum: [
          { required: true, message: "请选择显示状态", trigger: "blur" },
        ],
        role: [{ required: true, message: "请选择显示状态", trigger: "blur" }],
      }
    }
  },
  components: {
    SearchTop
  },
  mounted() {
    this.getTableList()
    this.getroles()
  },
  methods: {
    queryList(params) {
      this.params = params
      this.getTableList()
    },
    async getTableList() {
      const res = await getUser(this.params)
      this.loading = false
      if (res.msg === 'success') {
        this.tableData = res.data
      } else {
        this.$message.error(res.data)
      }
    },
    showDialog() {
      this.addType = 1
      this.shopList = JSON.parse(sessionStorage.getItem('shopList'))
      this.dialogVisible = true;
      this.title = '添加用户'
      this.formparam.shopNum = ''
      this.formparam.mobile = ''
      this.formparam.name = ''
      this.formparam.role = ''
      this.roles = []
    },
    // 查询场馆用户角色信息
    async getroles(shopNum) {
      const res = await searchRole({shopNum})
      if (res.msg == 'success') {
        this.roles = res.data
      } else {
        this.$message.error(res.data)
      }
    },
    // 切换场馆
    changeShop(shopNum) {
      this.getroles(shopNum)
      this.formparam.role = ''
    },
    edit(row) {
      this.addType = 2
      this.title = '修改用户密码'
      this.formparam.userId = row.id
      this.dialogVisible = true
      this.formparam.password = ''
      this.password = ''
    },
    edit2(row) {
      this.addType = 4
      this.title = '修改用户角色'
      this.roles = []
      this.formparam.userId = row.id
      this.dialogVisible = true
      this.formparam.shopNum = row.shopNum
      this.getroles(row.shopNum)
      this.formparam.role = row.role
    },
    edit3(row) {
      this.addType = 3
      this.title = '修改用户手机号'
      this.roles = null
      this.formparam.userId = row.id
      this.dialogVisible = true
      this.formparam.userName = null
      this.formparam.password = null
      this.formparam.shopNum = null
      this.formparam.role = null
      this.formparam.mobile = ''
      this.formparam.vCode = ''
    },
    // 获取验证码
    async getCode(mobile) {
      const res = await UsergetVCode({ mobile })
      if (res.msg == 'success') {
        this.$message({
          type: 'success',
          message: '获取验证码成功'
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
        this.$message.error(res.data)
      }
    },
    submitSetInfo(formparam) {
      this.$refs[formparam].validate(async (valid) => {
        if (valid) {
          if (this.addType == 1) {
            if (this.formparam.role == '') {
              this.formparam.role = JSON.parse(sessionStorage.getItem('userinfo')).role
            }
            const res= await insertUser(this.formparam)
            if (res.msg === 'success') {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '增加成功'
              });
              this.dialogVisible = false
              this.getTableList()
            } else {
              this.$message.error(res.data)
            }
          } else if (this.addType == 2) {
            var eles = []
            eles.push(this.formparam.password)
            this.password = this.common.encode("0x12", eles)
            const res = await updateUser({
              userId: this.formparam.userId,
              password: this.password
            })
            if (res.msg === 'success') {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.dialogVisible = false
              this.getTableList()
            } else {
              this.$message.error(res.data)
            }
          } else if (this.addType == 3) {
            const res = await updateUserMobile(this.formparam)
            if (res.msg === 'success') {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.dialogVisible = false
              this.getTableList()
            } else {
              this.$message.error(res.data)
            }
          } else if (this.addType == 4) {
            const res = await updateUserRole({
              userId: this.formparam.userId,
              role: this.formparam.role
            })
            if (res.msg === 'success') {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.dialogVisible = false
              this.getTableList()
            } else {
              this.$message.error(res.data)
            }
          }
        } else {
          return this.$message.error("请检查必填项")
        }
      })
    },
    removData(row) {
      this.$confirm('此操作将删除当前用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await empldeleteUser({ id: row.id })
        if (res.msg == 'success') {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getTableList()
        } else {
          this.$message.error(res.data)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    resetForm(formparam) {
      this.dialogVisible = false;
      this.$refs[formparam].clearValidate();
    },
    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.params.pageNo = 1
      this.currentPage = 1
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.params.pageNo = val
      this.getTableList()
    },
    // 筛选分店名
    getShopName(shopNum) {
      let shopList = JSON.parse(sessionStorage.getItem('shopList'))
      let element = shopList.find(item => item.shopNum == shopNum)
      if (element) {
        return element.name
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#userInfo {
  width: 100%;
  height: 100%;
  .box-card {
    height: 100%;
  }
  .el-select {
    width: 100%;
  }
}
</style>