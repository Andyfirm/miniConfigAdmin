<template>
  <div id="ticketType">
    <el-card class="box-card">
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="4">
          <el-input
            size="small"
            class="w150"
            placeholder="请输入类型名"
            v-model="params.name"
            clearable
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button
            size="small"
            class="ml20"
            type="primary"
            icon="el-icon-search"
            @click="queryList"
            >查询</el-button
          >
        </el-col>
        <el-col :span="2" :offset="16">
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
        <el-table :data="tableData" height="69vh" border stripe>
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column prop="ticketType" label="票类型名称"></el-table-column>
          <el-table-column width="80" label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="edit(scope.row)"
                >编辑</el-button
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
    <el-dialog
      :title="addType == 1 ? '增加票类型' : '修改票类型'"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form
        :model="formparams"
        :rules="rules"
        ref="formparams"
        label-width="120px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="票类型名称" prop="type">
              <el-input
                class="w220"
                v-model="formparams.type"
                placeholder="请输入票类型名称"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
  </div>
</template>

<script>
import { getTicketType, insertTicketType, updateTicketType } from '../../api/index'
export default {
  name: 'ticketType',
  data() {
    return {
      params: {
        name: '',
        pageNo: 1,
        pageSize: 20
      },
      tableData: [],
      total: 0,
      currentPage: 1,
      addType: 1,
      dialogVisible: false,
      formparams: {
        type: ""
      },
      rules: {
        type: [
          { required: true, message: "请输入票类型名称", trigger: "blur" }
        ]
      }
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    queryList() {
      this.params.pageNo = 1;
      this.currentPage = 1;
      this.getTableList();
    },
    async getTableList() {
      const res = await getTicketType(this.params)
      if (res.msg === "success") {
        this.tableData = res.data.info
        this.total = res.data.total
      } else {
        this.$message.error(res.data)
      }
    },
    showDialog() {
      this.dialogVisible = true
      this.addType = 1
      this.formparams.type = ""
      this.clearForm("formparams")
    },
    edit(row) {
      this.addType = 2
      this.dialogVisible = true
      this.formparams.type = row.ticketType
      this.formparams.typeId = row.tid
      this.clearForm("formparams")
    },
    submitForm(formparams) {
      this.$refs[formparams].validate(async (valid) => {
        if (valid) {
          if (this.addType == 1) {
            const res = await insertTicketType(this.formparams)
            if (res.msg === "success") {
              this.$message.success("添加成功")
              this.dialogVisible = false
              this.getTableList()
            } else {
              this.$message.error(res.data)
            }
          } else {
            const res = await updateTicketType(this.formparams)
            if (res.msg === "success") {
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
    // 取消
    resetForm(formparams) {
      this.dialogVisible = false;
      this.$refs[formparams].clearValidate();
    },
    clearForm(formName) {
      this.$refs[formName].clearValidate();
    },
    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.params.pageNo = 1;
      this.currentPage = 1;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.params.pageNo = val;
      this.getTableList();
    },
  }
}
</script>