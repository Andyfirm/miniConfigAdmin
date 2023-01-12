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
            @click="showDialog"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <el-dialog
        :title="addType == 1 ? '添加账号' : '修改账号'"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <el-form
          :model="formparams"
          :rules="rules"
          ref="formparams"
          label-width="120px"
        >
          <el-form-item label="账号" prop="name">
            <el-input
              v-model="formparams.name"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formparams.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司" prop="company">
            <el-input
              v-model="formparams.company"
              placeholder="请输入公司名称"
            ></el-input>
          </el-form-item>
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
          height="73vh"
          border
          stripe
        >
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label="账号"></el-table-column>
          <el-table-column prop="password" label="密码"></el-table-column>
          <el-table-column
            prop="clubMemberCode"
            label="所属数据源"
          ></el-table-column>
          <el-table-column prop="company" label="公司"></el-table-column>
          <el-table-column width="150" label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="edit(scope.row)"
                >编辑</el-button
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
    </el-card>
  </div>
</template>

<script>
import {
  selectSmsMessage,
  updateSmsMessage,
  getClubMemberCodes,
  insertSmsMessage,
  deleteSmsMessage,
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
      //数据源标识
      clubMemberCodeS: [],
      formparams: {
        id: "",
        name: "",
        password: "",
        company: "",
        clubMemberCode: "",
        role: "common"
      },
      //表单校验
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        company: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
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
    this.selectSmsMessage();
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
      this.formparams.id = "";
      this.formparams.name = "";
      this.formparams.password = "";
      this.formparams.company = "";
      this.formparams.clubMemberCode = "";
      this.addType = 1;
      this.getClubMemberCodes();
    },
    selectSmsMessage() {
      selectSmsMessage().then((res) => {
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
          this.$confirm(
            "短信配置完成，请联系短信服务商进行免审，否则将无法正常使用短信推送功能, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              this.formparams.password = escape(this.formparams.password);
              if (this.addType == 2) {
                //修改
                updateSmsMessage(this.formparams).then((res) => {
                  if (res.msg == "success") {
                    this.dialogVisible = false;
                    this.$message({
                      message: "修改成功",
                      type: "success",
                    });
                    this.selectSmsMessage();
                  } else {
                    this.$message.error("失败");
                  }
                });
              } else if (this.addType == 1) {
                //添加
                for (let i = 0; i < this.tableData.length; i++) {
                  if (
                    this.tableData[i].clubMemberCode ==
                    this.formparams.clubMemberCode
                  ) {
                    return this.$message.error("该数据源已存在,不能重复添加");
                  }
                }
                insertSmsMessage(this.formparams).then((res) => {
                  if (res.msg == "success") {
                    this.dialogVisible = false;
                    this.$message({
                      message: "添加成功",
                      type: "success",
                    });
                    this.selectSmsMessage();
                  } else {
                    this.$message.error(res.data);
                  }
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除",
              });
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formparams) {
      this.dialogVisible = false;
      this.$refs[formparams].clearValidate();
    },
    edit(row) {
      this.formparams.id = row.id;
      this.formparams.name = row.name;
      this.formparams.password = row.password;
      this.formparams.company = row.company;
      this.formparams.clubMemberCode = row.clubMemberCode;
      this.addType = 2;
      this.dialogVisible = true;
      this.formparams.userId = row.id;
    },
    removeList(id) {
      this.$confirm("此操作将永久删除该账户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteSmsMessage({ id: id }).then((res) => {
            if (res.msg == "success") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.selectSmsMessage();
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