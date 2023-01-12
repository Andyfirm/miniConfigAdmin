<template>
  <div id="dataSource">
    <el-card class="box-card">
      <el-row style="margin-bottom:20px;">
        <el-col :offset="22" :span="2">
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
          <el-table-column prop="clubName" label="公司名称"></el-table-column>
          <el-table-column prop="ip" label="数据库ip"></el-table-column>
          <el-table-column prop="port" label="数据库端口"></el-table-column>
          <el-table-column prop="dataBaseName" label="数据库名"></el-table-column>
          <el-table-column width="260" label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="edit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="payset(scope.row)"
                >支付设置</el-button
              >
              <el-button
                size="small"
                type="warning"
                @click="setConfig(scope.row)"
                >配置功能</el-button
              >
              <!-- <el-button
                size="small"
                type="warning"
                @click="setModel(scope.row)"
                >模式配置</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <el-dialog title="数据源配置" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="formparams"
        :rules="rules"
        ref="formparams"
        label-width="120px"
      >
        <el-form-item label="公司名称" prop="clubName">
          <el-input v-model="formparams.clubName"></el-input>
        </el-form-item>
        <el-form-item label="数据库库ip" prop="ip">
          <el-input v-model="formparams.ip"></el-input>
        </el-form-item>
        <el-form-item label="数据库端口" prop="port">
          <el-input v-model="formparams.port"></el-input>
        </el-form-item>
        <el-form-item label="数据库名" prop="dataBaseName">
          <el-input v-model="formparams.dataBaseName"></el-input>
        </el-form-item>
        <el-form-item label="数据库用户名" prop="userName">
          <el-input v-model="formparams.userName"></el-input>
        </el-form-item>
        <el-form-item label="数据库密码" prop="password">
          <el-input v-model="formparams.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button style="width: 100px" @click="resetForm('formparams')"
          >取 消</el-button
        >
        <el-button
          style="width: 100px"
          type="primary"
          :disabled="showDisabled"
          @click="submitForm('formparams')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDataSource, addDataSource, updateDataSource } from '../../api/index'
export default {
  name: 'dataSource',
  data() {
    return {
      loading: true,
      dialogVisible: false,
      addType: 1,
      showDisabled: false,
      formparams: {
        clubName: "", //公司名称
        ip: "", //数据库ip
        port: "", //端口
        dataBaseName: "", //数据库名
        userName: "", //数据库用户名
        password: "", //数据库密码
        typeStatus: "1",
        memberDataSourceIfUpdate: "0",
        employeeDataSourceIfUpdate: "0",
      },
      //表单校验
      rules: {
        clubName: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        ip: [
          { required: true, message: "请输入数据库IP地址", trigger: "blur" },
        ],
        port: [{ required: true, message: "请输入端口号", trigger: "blur" }],
        dataBaseName: [
          { required: true, message: "请输入数据库名称", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入数据库用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入数据库密码", trigger: "blur" },
        ],
      },
      //数据源列表
      tableData: [],
      total: 0,
      currentPage: 1,
      params: {
        page: 1,
        size: 20,
      },
      qiyongloading: false,
      qiyongid: null,
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    async getTableList() {
      const res = await getDataSource()
      this.loading = false
      if (res.msg === "success") {
        this.tableData = res.data
      } else {
        this.$error.message(res.data)
      }
    },
    showDialog() {
      this.dialogVisible = true;
      this.addType = 1;
      this.formparams.typeStatus = "1";
      this.formparams.memberDataSourceIfUpdate = "0";
      this.formparams.employeeDataSourceIfUpdate = "0";
      this.formparams.clubName = "";
      this.formparams.ip = "" //数据库ip
      this.formparams.port = "" //端口
      this.formparams.dataBaseName = "" //数据库名
      this.formparams.userName = "" //数据库用户名
      this.formparams.password = "" //数据库密码
    },
    edit(row) {
      this.addType = 2;
      this.dialogVisible = true;
      this.formparams.id = row.id;
      this.formparams.ip = row.ip;
      this.formparams.clubName = row.clubName;
      this.formparams.port = row.port;
      this.formparams.dataBaseName = row.dataBaseName;
      this.formparams.userName = row.userName //数据库用户名
      this.formparams.password = row.userPassword //数据库密码
      if (row.typestatus) {
        this.formparams.typeStatus = row.typestatus.toString();
      } else {
        this.formparams.typeStatus = "0";
      }
      if (row.memberDataSourceIfUpdate) {
        this.formparams.memberDataSourceIfUpdate = row.memberDataSourceIfUpdate.toString();
      } else {
        this.formparams.memberDataSourceIfUpdate = "0";
      }
      if (row.employeeDataSourceIfUpdate) {
        this.formparams.employeeDataSourceIfUpdate = row.employeeDataSourceIfUpdate.toString();
      } else {
        this.formparams.employeeDataSourceIfUpdate = "0";
      }
    },
    submitForm(formparams) {
      this.$refs[formparams].validate(async (valid) => {
        if (valid) {
          if (this.addType == 1) {
            this.formparams.clubName = this.formparams.clubName.replace(
              /\s*/g,
              ""
            );
            this.formparams.ip = this.formparams.ip.replace(/\s*/g, "");
            this.formparams.port = this.formparams.port.replace(/\s*/g, "");
            this.formparams.dataBaseName = this.formparams.dataBaseName.replace(
              /\s*/g,
              ""
            );
            this.formparams.userName = this.formparams.userName.replace(
              /\s*/g,
              ""
            );
            this.formparams.password = this.formparams.password.replace(
              /\s*/g,
              ""
            );
            this.showDisabled = true
            const res = await addDataSource(this.formparams)
            this.showDisabled = false
            if (res.msg === 'success') {
              this.$message.success("添加成功")
              this.dialogVisible = false
              this.getTableList()
            } else {
              this.$message.error(res.data)
            }
          } else {
            this.showDisabled = true
            const res = await updateDataSource(this.formparams)
            this.showDisabled = false
            if (res.msg === 'success') {
              this.$message.success("修改成功")
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
    payset(row) {
      this.$router.push({
        name: "paySet",
        query: { clubMemberCode: row.clubMemberCode }
      });
    },
    setConfig(row) {
      this.$router.push({
        path: "/rootConfig",
        query: { clubMemberCode: row.clubMemberCode }
      });
    },
    resetForm(formparams) {
      this.dialogVisible = false;
      this.$refs[formparams].clearValidate();
    },
  }
}
</script>