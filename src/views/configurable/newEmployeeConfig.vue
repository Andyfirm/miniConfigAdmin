<template>
  <div class="app-container">
    <el-card class="tableInfo">
      <el-row class="headTop" style="margin-bottom:20px;">
        <el-col :span="22">
          <span>
            数据源：<el-select
              size="small"
              class="w150 mr20"
              v-model="clubMemberCode"
              clearable
              placeholder="请选择数据源"
              @change="changeDataType(clubMemberCode)"
            >
              <el-option
                v-for="item in this.dataTypeList"
                :key="item.clubMemberCode"
                :label="item.clubName"
                :value="item.clubMemberCode"
              ></el-option>
            </el-select>
          </span>
        </el-col>
        <el-col :span="2">
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
        title="推送消息配置"
        :visible.sync="dialogVisible"
        width="1000px"
      >
        <el-form
          :model="formparams"
          :rules="rules"
          ref="formparams"
          label-width="120px"
        >
          <el-form-item label="数据源" prop="clubMemberCode">
            <el-select
              v-model="formparams.clubMemberCode"
              :disabled="disabledClub"
              placeholder="请选择"
            >
              <el-option
                v-for="item in this.dataTypeList"
                :key="item.clubMemberCode"
                :label="item.clubName"
                :value="item.clubMemberCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推送类型" prop="id">
            <el-select
              v-model="formparams.typeId"
              :disabled="disabledClub"
              placeholder="请选择"
            >
              <el-option
                v-for="item in this.tuisongTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板id" prop="modelid">
            <el-input
              v-model="formparams.modelid"
              placeholder="请输入消息模板ID"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="配置说明">
              <el-input v-model="formparams.remark" disabled="disabled" placeholder="请输入消息配置说明"></el-input>
            </el-form-item> -->
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
          <el-table-column prop="modelid" label="消息模板ID"></el-table-column>
          <el-table-column prop="name" label="类型"></el-table-column>
          <el-table-column label="操作" width="150">
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
                @click="remove(scope.row)"
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
  getDataSource,
  getTbEPushMessageModel,
  insertTbEPushMessageModel,
  deleteTbEPushMessageModel,
  updateTbEPushMessageModel,
  getTbEPushType,
} from "../../api/index.js";

export default {
  data() {
    return {
      loading: true,
      dialogVisible: false,
      disabledClub: false,
      addType: 1,
      dataTypeList: [],
      tuisongTypeList: [],
      titleList: [],
      clubMemberCode: "",
      formparams: {
        typeId: "",
        modelid: "",
        clubMemberCode: "",
      },
      newData: "",
      rules: {
        typeId: [
          { required: true, message: "请选择推送类型", trigger: "change" },
        ],
        clubMemberCode: [
          { required: true, message: "请选择数据源", trigger: "change" },
        ],
        modelid: [{ required: true, message: "模板id不能为空" }],
      },
      formData: {},
      fileList: [], //图片回显示
      tableData: [],
    };
  },
  components: {
  },
  beforeCreate() {
  },
  created() {
    this.getDataList();
    this.getTbEPushType();
  },
  mounted() {},
  methods: {
    //获取数据源列表
    getDataList() {
      getDataSource().then((res) => {
        if (res.msg == "success") {
          this.dataTypeList = res.data;
          if (res.data[0]) {
            this.clubMemberCode = res.data[0].clubMemberCode;
            this.getTableList();
          }
        } else {
          this.$error.message(res.data);
        }
        this.loading = false;
      });
    },
    //获取员工推送类型列表
    // GET /message/getTbEPushType
    getTbEPushType() {
      getTbEPushType().then((res) => {
        if (res.msg == "success") {
          this.tuisongTypeList = res.data;
        } else {
          this.$error.message(res.data);
        }
        this.loading = false;
      });
    },
    changeDataType(clubCode) {
      this.clubMemberCode = clubCode;
      this.getTableList();
    },
    showDialog() {
      this.formparams.name = "";
      this.formparams.modelid = "";
      this.formparams.clubMemberCode = "";
      this.formparams.id = null;
      this.dialogVisible = true;
      this.disabledClub = false;
      this.addType = 1;
    },
    getTableList() {
      getTbEPushMessageModel({ clubMemberCode: this.clubMemberCode }).then(
        (res) => {
          this.loading = false;
          this.tableData = res.data;
        }
      );
    },
    filterHandler(value, row) {
      return row.shopNum === value;
    },
    //编辑
    edit(row) {
      this.addType = 2;
      this.formparams.typeId = row.typeId;
      this.formparams.modelid = row.modelid;
      this.dialogVisible = true;
      this.formparams.id = row.id;
      this.disabledClub = true;
      this.formparams.clubMemberCode = this.clubMemberCode;
    },
    remove(row) {
      this.$confirm("此操作将永久删除该消息模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTbEPushMessageModel({
            id: row.id,
            clubMemberCode: this.clubMemberCode,
          }).then((res) => {
            if (res.msg == "success") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
            } else {
              this.$message.error(res.data);
            }
            this.dialogVisible = false;
            this.getTableList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    submitForm(formparams) {
      this.$refs[formparams].validate((valid) => {
        if (valid) {
          this.tuisongTypeList.forEach((item) => {
            if (item.id == this.formparams.typeId) {
              this.formparams.name = item.name;
            }
          });
          if (this.addType == 1) {
            insertTbEPushMessageModel(this.formparams).then((res) => {
              if (res.msg == "success") {
                this.$message({
                  type: "success",
                  message: "添加成功",
                });
              } else {
                this.$message.error(res.data);
              }
              this.dialogVisible = false;
              this.getTableList();
            });
          } else {
            updateTbEPushMessageModel(this.formparams).then((res) => {
              if (res.msg == "success") {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
              } else {
                this.$message.error(res.data);
              }
              this.dialogVisible = false;
              this.getTableList();
            });
          }
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
  },
};
</script>
<style scoped lang="scss">
</style>