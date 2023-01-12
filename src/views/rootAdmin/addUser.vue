<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row class="headTop" style="margin-bottom:20px;">
        <el-col :span="2" :offset="22">
          <el-button
            style="float:right;"
            size="small"
            type="success"
            icon="el-icon-circle-plus-outline"
            @click="showDialog()"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <el-dialog
        :title="addType == 1 ? '添加用户' : '修改密码'"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <el-form
          :model="formparams"
          :rules="rules"
          ref="formparams"
          label-width="120px"
        >
          <el-form-item label="用户名" prop="userName" v-if="addType == 1">
            <el-input
              v-model="formparams.userName"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="角色" v-if="addType==1">
                <el-select v-model="formparams.role" placeholder="请选择">
                  <el-option
                    v-for="item in this.userRole"
                    :key="item.role"
                    :label="item.remark"
                    :value="item.role"
                  ></el-option>
                </el-select>
              </el-form-item> -->
          <el-form-item
            label="所属数据源"
            v-if="addType == 1"
            prop="clubMemberCode"
          >
            <el-select v-model="formparams.clubMemberCode" placeholder="请选择">
              <el-option
                v-for="item in this.clubMemberCodeS"
                :key="item.clubmembercode"
                :label="item.clubname"
                :value="item.clubmembercode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="addType == 2" label="新密码" prop="password">
            <el-input
              v-model="formparams.password"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button style="width: 100px" @click="resetForm('formparams')"
            >取 消</el-button
          >
          <el-button
            style="width: 100px"
            type="primary"
            @click="submitForm('formparams')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-row class="tableList">
        <el-table
          v-loading="loading"
          :data="tableData"
          height="69vh"
          border
          stripe
        >
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="role" label="角色">
            <template slot-scope="scope">
              <span v-if="scope.row.role == 'common'"> 客户普通账号 </span>
              <span v-else-if="scope.row.role == 'root'"> 管理员 </span>
            </template>
          </el-table-column>
          <el-table-column prop="clubName" label="所属数据源"></el-table-column>
          <el-table-column width="180" label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="edit(scope.row)"
                >修改密码</el-button
              >
              <el-button
                size="small"
                type="danger"
                @click="removeList(scope.row.id)"
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
  </div>
</template>

<script>
import {
  getUser,
  registUser,
  getClubMemberCodes,
  updateUser,
  deleteUser,
} from "../../api/index";

export default {
  data() {
    return {
      loading: true,
      dialogVisible: false,
      query: {
        userName: "",
      },
      addType: 1,
      //角色标识
      userRole: [],
      //数据源标识
      clubMemberCodeS: [],
      password: "",
      formparams: {
        userName: "",
        role: "common",
        clubMemberCode: "",
        password: "",
      },
      //表单校验
      rules: {
        userName: [
          {
            required: true,
            min: 6,
            max: 10,
            message: "请输入6-10位字母或字母数字结合的用户名",
          },
          {
            pattern: /^(?![0-9]+$)[0-9A-Za-z]{6,10}$/,
            message: "请输入6-10位字母或字母数字结合的用户名",
            trigger: "change",
          },
        ],
        clubMemberCode: [
          { required: true, message: "请选择所属数据源", trigger: "change" },
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
            trigger: "change",
          },
        ],
      },
      //用户列表
      tableData: [],
      total: 0,
      currentPage: 1,
      params: {
        page: 1,
        size: 20,
      },
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
      this.addType = 1;
      // this.userGetrole()
      this.formparams.userName = "";
      this.formparams.clubMemberCode = "";
      this.getClubMemberCodes();
      this.clearForm("formparams");
    },
    //获取用户角色权限列表
    // userGetrole(){
    //   userGetrole().then((res)=>{
    //     if(res.msg=='success'){
    //       this.userRole = res.data
    //     } else {
    //       this.$message.error(res.data)
    //     }
    //   })
    // },
    getUser() {
      getUser().then((res) => {
        if (res.msg == "success") {
          this.tableData = res.data;
        } else {
          this.$message.error(res.data);
        }
        this.loading = false;
      });
    },
    //获取数据源列表
    getClubMemberCodes() {
      getClubMemberCodes().then((res) => {
        if (res.msg == "success") {
          this.clubMemberCodeS = res.data;
        } else {
          this.$message.error(res.data);
        }
      });
    },
    //提交增加数据源接口
    // addDataSource
    submitForm(formparams) {
      this.$refs[formparams].validate((valid) => {
        if (valid) {
          if (this.addType == 1) {
            registUser(this.formparams).then((res) => {
              if (res.msg == "success") {
                this.dialogVisible = false;
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.getUser();
              } else {
                this.$message.error("失败");
              }
            });
          } else {
            this.password = this.formparams.password;
            var eles = [];
            eles.push(this.password);
            // var esz = this.encode("0x12",eles);
            this.password = this.common.encode("0x12", eles);

            // var eles = [];
            // eles.push(this.formparams.password);
            // // var esz = this.encode("0x12",eles);
            // this.formparams.password = this.common.encode("0x12",eles)

            updateUser({
              userId: this.formparams.userId,
              password: this.password,
            }).then((res) => {
              if (res.msg == "success") {
                this.dialogVisible = false;
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.getUser();
              } else {
                this.$message.error(res.data);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].clearValidate();
    },
    clearForm(formName) {
      this.$refs[formName].clearValidate();
    },
    edit(row) {
      // this.$message.error('暂未开发')
      this.addType = 2;
      this.dialogVisible = true;
      this.formparams.userId = row.id;
      this.formparams.password = "";
      this.password = "";
      this.clearForm("formparams");
    },
    removeList(id) {
      this.$confirm("此操作将永久删除该账户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUser({ id: id }).then((res) => {
            if (res.msg == "success") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.getUser();
            } else {
              this.$message.error(res.data);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //分页
    handleSizeChange(val) {
      this.params.size = val;
      this.params.page = 1;
      this.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.params.page = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>