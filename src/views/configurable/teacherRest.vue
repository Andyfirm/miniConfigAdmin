<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row style="margin-bottom:20px;">
        <el-col :span="2">
          <el-button class="goBack" size="small" @click="goback()" icon="el-icon-arrow-left"
            >返回上一级</el-button
          >
        </el-col>
        <el-col :span="2" :offset="20">
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
      <el-dialog title="时间设置" :visible.sync="dialogVisible" width="1000px">
        <el-form
          :model="formparams"
          :rules="rules"
          ref="formparams"
          label-width="150px"
        >
          <el-form-item label="休息日期" prop="date">
            <el-date-picker
              v-model="date"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="休息时间" required>
            <el-time-select
              placeholder="起始时间"
              v-model="formparams.startTime"
              :picker-options="{
                start: '08:00',
                step: '00:30',
                end: '22:00',
              }"
            >
            </el-time-select> - 
            <el-time-select
              placeholder="结束时间"
              v-model="formparams.endTime"
              :picker-options="{
                start: '08:00',
                step: '00:30',
                end: '22:00',
                minTime: startTime,
              }"
            >
            </el-time-select>
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
          height="75vh"
          border
          stripe
        >
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <!-- <el-table-column prop="appointmenttime" label="提前预约时间"></el-table-column> -->
          <el-table-column label="教练姓名">
            <template>
              <div>
                {{ name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="日期">
            <template slot-scope="scope">
              <div>{{ scope.row.startdate }}</div>
            </template>
          </el-table-column>
          <el-table-column label="休息开始时间">
            <template slot-scope="scope">
              <div>{{ scope.row.starttime }}</div>
            </template>
          </el-table-column>
          <el-table-column label="休息结束时间">
            <template slot-scope="scope">
              <div>{{ scope.row.endtime }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button style="width:100px"  type="primary" @click="edit(scope.row)">编辑</el-button>
              <el-button style="width:100px"  type="danger" @click="remove(scope.row)">删除</el-button>

            </template>
          </el-table-column> -->
        </el-table>
      </el-row>
    </el-card>
  </div>
</template>

<script>
let that;
import { getEBreakTime, insertEBreakTime } from '../../api/index'
export default {
  data() {
    var validDate = (rule, value, callback) => {
      if (!this.date[0] || !this.date[1]) {
        callback(new Error("请选择日期"));
      } else {
        callback();
      }
    };
    return {
      loading: true,
      dialogVisible: false,
      date: [], //开始时间结束时间
      rules: {
        date: [
          {
            required: true,
            trigger: "change",
            validator: validDate,
          },
        ],
      },
      startTime: "",
      endTime: "",
      name: this.$route.query.name,
      formparams: {
        id: this.$route.query.id,
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
      },
      tableData: [],
      //场馆列表
      shopList: [],
      shopListAll: JSON.parse(sessionStorage.getItem("shopListAll")),
      total: 0,
      currentPage: 1,
      params: {
        pageNo: 1,
        pageSize: 20,
      },
    };
  },
  filters: {
    caseType(value) {
      if (
        that.shopListAll.find((i) => {
          return i.shopNum == value;
        })
      ) {
        return that.shopListAll.find((i) => {
          return i.shopNum == value;
        }).name;
      }
    },
    className(value) {
      if (
        that.classProject.find((i) => {
          return i.itemstyle == value;
        })
      ) {
        return that.classProject.find((i) => {
          return i.itemstyle == value;
        }).name;
      }
    },
  },
  created() { },
  mounted() {
    this.getTableList();
  },
  methods: {
    goback() {
      // this.$router.go(-1)
      this.$router.push({
        name: "teacherInfo",
        query: { queryParams: this.$route.query.queryParams },
      });
    },
    getTableList() {
      getEBreakTime({ id: this.$route.query.id }).then((res) => {
        if (res.msg == "success") {
          this.tableData = res.data;
        }
        this.loading = false;
      });
    },
    showDialog() {
      this.dialogVisible = true;
      this.addType = 1;
    },
    //编辑
    edit() {
      this.addType = 2;
      this.dialogVisible = true;
    },
    submitForm(formparams) {
      this.$refs[formparams].validate((valid) => {
        if (valid) {
          if (
            this.formparams.startTime == "" ||
            this.formparams.endTime == ""
          ) {
            this.$message.error("时间必选选择");
            return;
          } else {
            this.formparams.startTime = this.formparams.startTime + ":00";
            this.formparams.endTime = this.formparams.endTime + ":00";
          }
          let dateNum = new Date(this.date[1]) - new Date(this.date[0]);
          if (dateNum / 1000 / 60 / 60 / 24 > 30) {
            this.$message.error("对不起，最大只能设置30天，请重新选择");
            return;
          }
          this.formparams.startDate = this.date[0];
          this.formparams.endDate = this.date[1];
          this.$confirm("设置后将不可修改不可删除, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              insertEBreakTime(this.formparams).then((res) => {
                if (res.msg == "success") {
                  this.dialogVisible = false;
                  this.$message({
                    type: "success",
                    message: "添加成功",
                  });
                }
                this.getTableList();
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消添加",
              });
            });
        } else {
          this.$message.error("请检查必填项");
          return false;
        }
      });
    },
    //取消
    resetForm(formparams) {
      this.dialogVisible = false;
      this.$refs[formparams].clearValidate();
    },
    //分页
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
  },
};
</script>
<style scoped lang="scss">
</style>